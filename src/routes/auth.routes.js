const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();


router.get('/test', authController.test);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', authMiddleware.tokenVerification, authController.profile);

module.exports = router;