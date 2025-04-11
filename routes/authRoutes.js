const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);

// Protected routes
router.get('/me', auth, authController.getMe);
router.put('/update', auth, authController.updateUser);
router.put('/update-password', auth, authController.updatePassword);
router.delete('/delete', auth, authController.deleteUser);

module.exports = router;