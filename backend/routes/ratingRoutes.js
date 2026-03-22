const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, ratingController.submitRating);
router.get('/owner', verifyToken, ratingController.getRatingsForStoreOwner);
router.get('/user', verifyToken, ratingController.getUserRatings);

module.exports = router;



