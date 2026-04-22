const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/me', authMiddleware, userController.getMyProfile);
router.get('/:userId/reviews', userController.getUserReviews);

module.exports = router;
