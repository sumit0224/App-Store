// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  app: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true, maxlength: 100 },
  body: { type: String, trim: true, maxlength: 2000 },
  isVerifiedPurchase: { type: Boolean, default: false },
  isHidden: { type: Boolean, default: false }, // admin/moderation
}, { timestamps: true });

// one review per user per a
reviewSchema.index({ app: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
