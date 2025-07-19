const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  recordSale,
  getSales,
  generateInvoice
} = require('../controllers/saleController');

router.post('/', auth, upload, recordSale);
router.get('/', auth, getSales);
router.get('/:id/invoice', auth, generateInvoice);

module.exports = router;