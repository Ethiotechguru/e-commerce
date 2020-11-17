const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const {check} = require('express-validator');
const User = require('../models/user');
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignUp);
router.post('/sign-up',
    [
        check('email')
         .isEmail()
         .withMessage('Invalid Email Address.')
         .normalizeEmail()
         .custom((value, {req})=>{
            return User.findOne({ email: value })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already exists.');
                }
            });
         }),
        check('password', 'password must be at least 5 character containing only alpha-numeric value')
         .isLength({min:5, max:26})
         .isAlphanumeric()
         .trim(),
        check('confirmPassword')
         .trim()
         .custom((value, {req})=>{
            if(value !== req.body.password){
                throw new Error('Password Must Match!');
            }
            return true;
        })
    ],
    authController.postSignUp
);
router.post('/login',
    check('email')
    .isEmail()
    .withMessage('Invalid Email Address')
    .normalizeEmail()
    .custom((value, {req})=>{
        return User.findOne({ email: value })
        .then(user => {
            if (!user) {
                return Promise.reject("Email Not Found!");
            }
        });
    }),
    check('password', 'Invalid Password')
     .isLength({min:5, max:26})
     .isAlphanumeric()
     .trim(),
    authController.postLogin
);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getResetPassword);
router.post('/reset', authController.postResetPassword);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;