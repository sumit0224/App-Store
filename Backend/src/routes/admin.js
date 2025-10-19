const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middlewares/auth');
const AppModel = require('../models/App');
const UserModel = require('../models/User');
const DownloadModel = require('../models/Download');
const ReviewModel = require('../models/Review');

// -----------------------------
// GET /api/admin/stats
// Get platform statistics
router.get('/stats', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalApps = await AppModel.countDocuments();
    const publishedApps = await AppModel.countDocuments({ isPublished: true });
    const pendingApps = await AppModel.countDocuments({ 
      flags: { $in: ['pending_review'] } 
    });
    
    const totalDownloads = await AppModel.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadsCount' } } }
    ]);
    
    const totalRevenue = await AppModel.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$downloadsCount', '$price'] } } } }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await UserModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentApps = await AppModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentDownloads = await DownloadModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      totalUsers,
      totalApps,
      publishedApps,
      pendingApps,
      totalDownloads: totalDownloads[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentActivity: {
        users: recentUsers,
        apps: recentApps,
        downloads: recentDownloads
      }
    });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// GET /api/admin/apps
// Get all apps for admin management
router.get('/apps', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, sort } = req.query;
    let filter = {};
    
    if (status === 'published') filter.isPublished = true;
    else if (status === 'pending') filter.flags = { $in: ['pending_review'] };
    else if (status === 'draft') filter.isPublished = false;
    
    let query = AppModel.find(filter)
      .populate('developer', 'name email')
      .populate('categories', 'name slug');
    
    if (sort === 'latest') query = query.sort({ createdAt: -1 });
    else if (sort === 'downloads') query = query.sort({ downloadsCount: -1 });
    else if (sort === 'rating') query = query.sort({ averageRating: -1 });
    
    const apps = await query
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await AppModel.countDocuments(filter);
    
    res.json({ 
      apps, 
      total, 
      page: parseInt(page), 
      totalPages: Math.ceil(total / limit) 
    });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// GET /api/admin/users
// Get all users
router.get('/users', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    let filter = {};
    
    if (role) filter.role = role;
    
    const users = await UserModel.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await UserModel.countDocuments(filter);
    
    res.json({ 
      users, 
      total, 
      page: parseInt(page), 
      totalPages: Math.ceil(total / limit) 
    });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// GET /api/admin/downloads
// Get download analytics
router.get('/downloads', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;
    let startDate;
    
    switch (period) {
      case '1d':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }
    
    const downloads = await DownloadModel.find({ createdAt: { $gte: startDate } })
      .populate('app', 'title')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    // Group by date for chart data
    const downloadsByDate = {};
    downloads.forEach(download => {
      const date = download.createdAt.toISOString().split('T')[0];
      downloadsByDate[date] = (downloadsByDate[date] || 0) + 1;
    });
    
    res.json({ 
      downloads, 
      downloadsByDate,
      period,
      total: downloads.length 
    });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// GET /api/admin/top-apps
// Get top apps by downloads
router.get('/top-apps', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const topApps = await AppModel.find({ isPublished: true })
      .populate('developer', 'name')
      .populate('categories', 'name')
      .sort({ downloadsCount: -1 })
      .limit(parseInt(limit));
    
    res.json({ topApps });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// POST /api/admin/apps/:id/approve
// Approve an app
router.post('/apps/:id/approve', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const appId = req.params.id;
    const app = await AppModel.findById(appId);
    
    if (!app) return res.status(404).json({ error: 'App not found' });
    
    app.isPublished = true;
    app.flags = app.flags.filter(f => f !== 'pending_review');
    await app.save();
    
    res.json({ message: 'App approved successfully', app });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// POST /api/admin/apps/:id/reject
// Reject an app
router.post('/apps/:id/reject', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const appId = req.params.id;
    const { reason } = req.body;
    
    const app = await AppModel.findById(appId);
    if (!app) return res.status(404).json({ error: 'App not found' });
    
    app.isPublished = false;
    app.flags = app.flags.filter(f => f !== 'pending_review');
    if (reason) app.flags.push(`rejected: ${reason}`);
    await app.save();
    
    res.json({ message: 'App rejected successfully', app });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// PUT /api/admin/users/:id/role
// Update user role
router.put('/users/:id/role', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    if (!['user', 'developer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.role = role;
    await user.save();
    
    res.json({ message: 'User role updated successfully', user: user.publicProfile() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
