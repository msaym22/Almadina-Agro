const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

router.get('/products', authMiddleware, analyticsController.getProductAnalytics);
router.get('/business', authMiddleware, analyticsController.getBusinessAnalytics);
router.get('/customers', authMiddleware, analyticsController.getCustomerAnalytics);

module.exports = router;