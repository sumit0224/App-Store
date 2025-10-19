const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  key: { type: String, required: true },      // S3 key / download URL
  versionNumber: { type: String, default: '1.0.0' },
  uploadedAt: { type: Date, default: Date.now }
});

const appSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  shortDescription: String,
  description: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  price: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  isPublished: { type: Boolean, default: false },
  flags: [String],
  downloadsCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  versions: [versionSchema],   // <-- added
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// helper to update rating
appSchema.methods.updateRating = async function(newRating, oldRating) {
  if (!this.reviewsCount) this.reviewsCount = 0;
  if (!this.averageRating) this.averageRating = 0;

  if (oldRating) {
    this.averageRating = ((this.averageRating * this.reviewsCount) - oldRating + newRating) / this.reviewsCount;
  } else {
    this.reviewsCount += 1;
    this.averageRating = ((this.averageRating * (this.reviewsCount -1)) + newRating) / this.reviewsCount;
  }
  await this.save();
};

module.exports = mongoose.model('App', appSchema);
