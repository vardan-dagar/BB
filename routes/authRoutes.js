const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { login, register } = require('../controllers/authController');
const express = require('express');
// Correct way to import and use controllers
const { specificFunction } = require('../controllers/controllerFile');
router.get('/endpoint', specificFunction);
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
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
