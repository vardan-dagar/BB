const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', auth, trackingController.getUserTrackings);
router.get('/:status', auth, trackingController.getTrackingsByStatus);
router.put('/:id/update-status', auth, trackingController.updateTrackingStatus);
router.get('/:id/history', auth, trackingController.getTrackingHistory);

module.exports = router;