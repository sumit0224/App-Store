const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middlewares/auth');
const AppModel = require('../models/App');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// AWS S3 setup (ensure environment variables are set)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});
const S3_BUCKET = process.env.S3_BUCKET_NAME;

// -----------------------------
// Create App Metadata
// POST /api/dev/apps
router.post('/apps', authenticate, requireRole('developer'), async (req, res, next) => {
  try {
    const { title, slug, shortDescription, description, categories, price, currency } = req.body;
    const app = new AppModel({
      title,
      slug,
      shortDescription,
      description,
      categories,
      price: price || 0,
      currency: currency || 'INR',
      developer: req.user._id,
      isPublished: false,
      flags: []
    });
    await app.save();
    res.status(201).json({ message: 'App created successfully', app });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// Get S3 Upload URL
// POST /api/dev/apps/:id/upload-url
router.post('/apps/:id/upload-url', authenticate, requireRole('developer'), async (req, res, next) => {
  try {
    const appId = req.params.id;
    const { filename, contentType } = req.body;

    const app = await AppModel.findById(appId);
    if (!app) return res.status(404).json({ error: 'App not found' });
    if (!app.developer.equals(req.user._id)) return res.status(403).json({ error: 'Not your app' });

    const key = `apps/${uuidv4()}-${filename}`;
    const uploadURL = s3.getSignedUrl('putObject', {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: 60 * 5, // 5 minutes
      ContentType: contentType
    });

    res.json({ uploadURL, key });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// Complete Upload (Add Version)
// POST /api/dev/apps/:id/complete-upload
router.post('/apps/:id/complete-upload', authenticate, requireRole('developer'), async (req, res, next) => {
  try {
    const appId = req.params.id;
    const { key, versionNumber } = req.body;
    if (!key) return res.status(400).json({ error: 'key is required' });

    const app = await AppModel.findById(appId);
    if (!app) return res.status(404).json({ error: 'App not found' });
    if (!app.developer.equals(req.user._id)) return res.status(403).json({ error: 'Not your app' });

    const versionNum = versionNumber || '1.0.0';
    const exists = app.versions.some(v => v.versionNumber === versionNum);
    if (exists) return res.status(409).json({ error: 'Version already exists' });

    app.versions.push({ key, versionNumber: versionNum });
    await app.save();

    res.json({
      message: 'Version added successfully',
      app,
      latestVersion: app.versions[app.versions.length - 1]
    });
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// Publish App (Auto-Approval 5 min)
// POST /api/dev/apps/:id/publish
router.post('/apps/:id/publish', authenticate, requireRole('developer'), async (req, res, next) => {
  try {
    const appId = req.params.id;
    const app = await AppModel.findById(appId);
    if (!app) return res.status(404).json({ error: 'App not found' });
    if (!app.developer.equals(req.user._id)) return res.status(403).json({ error: 'Not your app' });

    app.isPublished = false;
    app.flags = Array.isArray(app.flags) ? app.flags : [];
    if (!app.flags.includes('pending_review')) app.flags.push('pending_review');
    await app.save();

    console.log(`Publish requested for app ${app._id} by developer ${req.user._id} - pending auto approval in 5min`);

    // Auto-approve after 5 minutes
    setTimeout(async () => {
      try {
        const freshApp = await AppModel.findById(appId);
        if (!freshApp) return;
        if (freshApp.flags.includes('pending_review')) {
          freshApp.isPublished = true;
          freshApp.flags = freshApp.flags.filter(f => f !== 'pending_review');
          await freshApp.save();
          console.log(`App ${freshApp._id} auto-approved after 5 minutes`);
        }
      } catch (err) {
        console.error('Error during auto-approval:', err);
      }
    }, 5 * 60 * 1000);

    res.json({ message: 'Publish requested. App will be auto-approved in 5 minutes.', app });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
