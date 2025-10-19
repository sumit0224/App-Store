const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middlewares/auth');
const AppModel = require('../models/App');
const ReviewModel = require('../models/Review');
const DownloadModel = require('../models/Download');

// -----------------------------
// GET /api/apps
// List apps with filters & pagination
router.get('/', async (req, res, next) => {
  try {
    let { page = 1, limit = 10, category, free, minPrice, maxPrice, sort } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let filter = { isPublished: true };

    if (category) filter.categories = category;
    if (free === 'true') filter.price = 0;
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };

    let query = AppModel.find(filter);

    // sorting
    if (sort) {
      if (sort === 'latest') query = query.sort({ createdAt: -1 });
      else if (sort === 'popular') query = query.sort({ downloadsCount: -1 });
    }

    const total = await AppModel.countDocuments(filter);
    const apps = await query.skip((page - 1) * limit).limit(limit);

    res.json({ page, totalPages: Math.ceil(total / limit), total, apps });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// GET /api/apps/:slug
// Get single app details
router.get('/:slug', async (req, res, next) => {
  try {
    const app = await AppModel.findOne({ slug: req.params.slug, isPublished: true });
    if (!app) return res.status(404).json({ error: 'App not found' });
    res.json(app);
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// POST /api/apps/:id/reviews
// Add or update review
router.post('/:id/reviews', authenticate, async (req, res, next) => {
  try {
    const appId = req.params.id;
    const { rating, title, body } = req.body;

    const app = await AppModel.findById(appId);
    if (!app || !app.isPublished) return res.status(404).json({ error: 'App not found' });

    let review = await ReviewModel.findOne({ app: appId, user: req.user._id });

    if (review) {
      // update review
      review.rating = rating;
      review.title = title;
      review.body = body;
      await review.save();
    } else {
      // create new
      review = new ReviewModel({ app: appId, user: req.user._id, rating, title, body });
      await review.save();
    }

    // update aggregate rating
    const reviews = await ReviewModel.find({ app: appId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    app.averageRating = avgRating;
    await app.save();

    res.json({ message: 'Review saved', review, averageRating: avgRating });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// POST /api/apps/:id/download
// Record download & return latest version key
router.post('/:id/download', authenticate, async (req, res, next) => {
  try {
    const appId = req.params.id;
    const app = await AppModel.findById(appId);
    if (!app || !app.isPublished) return res.status(404).json({ error: 'App not found' });

    if (!app.versions || app.versions.length === 0) {
      return res.status(400).json({ error: 'No versions available for download' });
    }

    const latestVersion = app.versions[app.versions.length - 1];

    // Record download
    const download = new DownloadModel({
      app: appId,
      user: req.user._id,
      versionKey: latestVersion.key
    });
    await download.save();

    app.downloadsCount = (app.downloadsCount || 0) + 1;
    await app.save();

    res.json({ message: 'Download recorded', latestVersionKey: latestVersion.key });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// GET /api/apps/:id/downloads
// Admin view downloads
router.get('/:id/downloads', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const appId = req.params.id;
    const downloads = await DownloadModel.find({ app: appId }).populate('user', 'name email');
    res.json({ downloads });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// GET /api/search?q=...
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

    // simple text search on title & description
    const apps = await AppModel.find({
      isPublished: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);

    res.json({ total: apps.length, apps });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
