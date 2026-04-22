const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    productId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
