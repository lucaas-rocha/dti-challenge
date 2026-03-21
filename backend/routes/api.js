const express = require('express');
const router = express.Router();

// Importing controller functions
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');

// Defining API routes and linking them to the respective controller functions
router.get('/products', productController.getProducts);
router.get('/cart', cartController.getCart);
router.post('/cart', cartController.addToCart);
router.put('/cart/:id', cartController.updateCartQuantity);
router.delete('/cart/:id', cartController.removeFromCart);
router.post('/checkout', cartController.checkout);

module.exports = router;