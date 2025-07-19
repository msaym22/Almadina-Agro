const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createBackup, restoreBackup } = require('../controllers/backupController');

router.get('/create', auth, createBackup);
router.post('/restore', auth, upload.backup, restoreBackup);

module.exports = router;