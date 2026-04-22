const axios = require('axios');
const Review = require('../models/Review');

exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    await axios.get(`${process.env.PRODUCT_SERVICE_URL}/api/products/${productId}`);

    const review = await Review.create({
      userId: req.user.id,
      userName: req.user.name,
      productId,
      rating,
      title,
      comment
    });

    res.status(201).json({ message: 'Review created successfully.', review });
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    res.status(500).json({ message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'You can update only your own review.' });
    }

    const { rating, title, comment } = req.body;
    review.rating = rating ?? review.rating;
    review.title = title ?? review.title;
    review.comment = comment ?? review.comment;

    await review.save();
    res.json({ message: 'Review updated successfully.', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'You can delete only your own review.' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
