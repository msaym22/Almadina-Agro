const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createCustomer,
  updateCustomer,
  getCustomers,
  getCustomerById,
  updateBalance
} = require('../controllers/customerController');

router.post('/', auth, createCustomer);
router.put('/:id', auth, updateCustomer);
router.get('/', auth, getCustomers);
router.get('/:id', auth, getCustomerById);
router.post('/:id/balance', auth, updateBalance);

module.exports = router;