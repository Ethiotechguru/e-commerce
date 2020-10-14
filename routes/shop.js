const express = require('express');
const shopController = require('../controller/shop');
const router = express.Router();



router.get('/', shopController.getProducts);

router.get('/product-list', shopController.getProductsList);
router.get('/product-list/:productId', shopController.getProductDetail);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.deleteCart);
router.get('/cart', shopController.getCart);
router.post('/create-order', shopController.createOrder);
router.get('/create-order ', shopController.getCreateOrder);
module.exports = router;