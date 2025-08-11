const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes in this file
router.use(protect);

router
  .route('/')
  .get(getWishlist)
  .post(addToWishlist);

router.route('/:productId').delete(removeFromWishlist);

module.exports = router;
