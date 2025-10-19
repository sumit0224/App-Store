
const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // anonymous possible
  app: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "App",
    required: true,
    index: true,
  },
  versionId: { type: mongoose.Schema.Types.ObjectId, required: false }, // reference to versions subdoc _id (if needed)
  ipAddress: { type: String },
  userAgent: { type: String },
  provider: { type: String, default: "direct" }, // e.g. 'direct', 'razorpay' (if paid)
  price: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  status: {
    type: String,
    enum: ["initiated", "completed", "failed"],
    default: "completed",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Download", downloadSchema);
