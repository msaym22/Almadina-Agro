const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
  bulkUpdate,
  checkLowStock
} = require('../controllers/productController');

router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.get('/', auth, getProducts);
router.get('/:id', auth, getProductById);
router.delete('/:id', auth, deleteProduct);
router.post('/bulk', auth, bulkUpdate);
router.get('/stock/low', auth, checkLowStock);

module.exports = router;