const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const { ensureAuthenticated } = require('../config/middleware');

router.get('/', ensureAuthenticated, homeController.home);
router.get('/auth/login', authController.login);
router.use('/post', require('./post'));
router.use('/auth', require('./auth'));
router.use('/api', require('./Api'));
module.exports = router;
