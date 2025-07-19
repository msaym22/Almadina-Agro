const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Should be POST method for login
router.post('/login', authController.login);

module.exports = router;