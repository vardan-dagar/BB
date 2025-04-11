const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');

// Public routes (for browsing)
router.get('/', bookController.getAllBooks);
router.get('/locations', bookController.getLocations);
router.get('/:id', bookController.getBook);

// Protected routes
router.post('/', auth, bookController.createBook);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);
router.post('/:id/request', auth, bookController.requestBook);
router.post('/:id/approve', auth, bookController.approveRequest);
router.post('/:id/reject', auth, bookController.rejectRequest);
router.post('/:id/return', auth, bookController.returnBook);

module.exports = router;