const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', auth, wishlistController.getUserWishlist);
router.post('/', auth, wishlistController.addToWishlist);
router.put('/:id', auth, wishlistController.updateWishlistItem);
router.delete('/:id', auth, wishlistController.removeFromWishlist);
router.post('/:id/fulfill', auth, wishlistController.markAsFulfilled);

module.exports = router;