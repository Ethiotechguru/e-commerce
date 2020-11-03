const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');

const adminController = require('../controller/admin');

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.adminProducts);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth,adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);


router.post('/delete-product', isAuth, adminController.postDeleteProduct);



module.exports = router;

