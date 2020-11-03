const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignUp);
router.post('/sign-up', authController.postSignUp);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getResetPassword);
router.post('/reset', authController.postResetPassword);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;