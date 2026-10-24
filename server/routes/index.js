const express = require('express');
const router = express.Router();
const { getProducts, addProduct, deleteProduct } = require('../controllers/productController');

router.get('/product', getProducts);

router.post('/product', addProduct);

router.delete('/product/:id', deleteProduct);

module.exports = router;
