const express = require('express');
const shopController = require('../controller/shop');
const router = express.Router();
const isAuth = require('../middleware/isAuth');


router.get('/', shopController.getProducts);

router.get('/product-list', shopController.getProductsList);
router.get('/product-list/:productId', shopController.getProductDetail);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.deleteCart);
router.get('/cart', isAuth, shopController.getCart);
router.post('/create-order', shopController.createOrder);
router.get('/create-order',isAuth, shopController.getCreateOrder);
router.post('/delete-order', shopController.deleteOrder);
module.exports = router;