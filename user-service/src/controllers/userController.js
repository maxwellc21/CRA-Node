const axios = require('axios');
const User = require('../models/User');

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const reviewsResponse = await axios.get(`${process.env.REVIEW_SERVICE_URL}/api/reviews/user/${req.user.id}`);

    res.json({
      user,
      reviews: reviewsResponse.data
    });
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    res.status(500).json({ message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviewsResponse = await axios.get(`${process.env.REVIEW_SERVICE_URL}/api/reviews/user/${req.params.userId}`);
    res.json(reviewsResponse.data);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    res.status(500).json({ message });
  }
};
