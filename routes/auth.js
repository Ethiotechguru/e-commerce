const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignUp);
router.post('/sign-up', authController.postSignUp);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
module.exports = router;