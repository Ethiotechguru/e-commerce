const express = require('express');
const router = express.Router();

const adminController = require('../controller/admin');

router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.adminProducts);

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);


router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;

