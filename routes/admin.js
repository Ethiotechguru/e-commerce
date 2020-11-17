const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { check } = require('express-validator');

const adminController = require('../controller/admin');

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.adminProducts);

router.post('/add-product',
    isAuth,
    [
        check('title')
            .isString().withMessage('Invalid Title')
            .isLength({ min: 5 }),
        check('price')
            .isFloat(),
        check('imageUrl'),
        check('description')
         .isString()
        .isLength({ min: 5 })
    ],
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth,
    [
        check('title')
            .isString().withMessage('Invalid Title')
            .isLength({ min: 2 }),
        check('price')
            .isFloat(),
        // check('imageUrl'),
        //     .isURL(),
        check('description')
        .isLength({ min: 5 })
    ],
    adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;

