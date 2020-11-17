
const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const {validationResult} = require('express-validator');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const transport = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: process.env.MAILER_SECRET,
    }
}));

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Log In',
        isAuthenticated: false,
        errorMessage:'',
        oldInput:{
            email:'',
            password:''
        },
        valErr:[]
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password.trim();
    const errors = validationResult(req);
    // if (email == '' || password == '') {
    //     req.flash('error', 'Email and password field are required!');
    //     return res.redirect('/login');
    // }
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Log In',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldInput:{
                email:email,
                password:password
            },
            valErr:errors.array()
        });
    }
    User.findOne({ email: email })
        .then(user => {
            // if (!user) {
            //     req.flash('error', 'Your Email is not found in our database');
            //     return res.redirect('/login');
            // }
            return bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return res.redirect('/');
                    } else {
                        return res.status(422).render('auth/login', {
                            path: '/login',
                            pageTitle: 'Log In',
                            isAuthenticated: false,
                            errorMessage: 'Incorrect Password',
                            oldInput:{
                                email:email,
                                password:password
                            },
                            valErr:[{param:'password'}]
                        });
                    }
                });
        }).catch(err => {
            console.log(err);
        });
};
exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        isAuthenticated: false,
        errorMessage: req.flash('error'),
        oldInput:{
            email:'',
            password:'',
            confirmPassword:'',
        },
        valErr:[]
    });
};


exports.postSignUp = (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password.trim();
    const errors = validationResult(req);
    if (email === '' || password==''){
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Sign Up',
            isAuthenticated: false,
            errorMessage: 'Email and password field is required',
            oldInput:{
                email:req.body.email,
                password:req.body.password,
                confirmPassword:req.body.confirmPassword
            },
            valErr:errors.array()
        });
    }
   
    if(!errors.isEmpty()){
        console.log(errors.array()[0].msg);
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Sign Up',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldInput:{
                email:email,
                password:password,
                confirmPassword:req.body.confirmPassword
            },
            valErr:errors.array()
        });
    }
  
    return bcrypt.hash(password, 12)
        .then(hashPassword => {
            const user = new User({
                email: email,
                password: hashPassword,
                cart: { items: [] },
            });
            return user.save();
        }).then(result => {
            res.redirect('/login');
            return transport.sendMail({
                to: email,
                from: 'samyethio891@gmail.com',
                subject: 'Sign up success Message',
                html: "<h1>You successfully Signed up!</h1>"
            }).catch(err=>{
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });

};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/login');
    });
};

exports.getResetPassword = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        isAuthenticated: false,
        errorMessage: req.flash('error'),
    });
};

exports.postResetPassword = (req, res, next) => {
    if (req.body.email.trim() == '') {
        req.flash('error', 'Email is Required!');
        return res.redirect('/reset');
    }
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        let userEmail;
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error');
                    return res.redirect(`/reset/${token}`);
                }
                userEmail = user.email;
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            }).then(result => {
                res.redirect('/');
                return transport.sendMail({
                    to: userEmail,
                    from: 'samyethio891@gmail.com',
                    subject: 'Pass word Reset Requested!',
                    html: `
                    <h4>
                        Click the <a href="http://localhost:3000/reset/${token}">Link</a> To reset Your password
                    </h4>
                    <p>if you didn't request password reset ignore this message</p>
                `
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {

            if (!user) {
                req.flash('error', "no user found associated with this email address");
                return res.redirect('/reset');
            }
            return res.render('auth/new-password', {
                path: '/newPassword',
                pageTitle: 'set new pass word',
                isAuthenticated: false,
                errorMessage: req.flash('error'),
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err, 'is coming from here');
        });
};

exports.postNewPassword = (req, res, next) => {
    const newPassWord = req.body.password;
    const confiPassWord = req.body.confirmPassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let theUser;
    if (newPassWord.trim() !== confiPassWord.trim()) {
        req.flash('error', "pass word don't match");
        return res.redirect(`/reset/${passwordToken}`);
    }
    User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() }
    })
        .then(user => {
            theUser = user;
            if (!user) {
                req.flash('error', "no user found Please Try Again");
                return res.redirect(`/reset/${passwordToken}`);
            }
            return bcrypt.hash(newPassWord, 12);

        }).then(hashPassword => {
            theUser.password = hashPassword;
            theUser.resetToken = undefined;
            theUser.resetToken = undefined;
            return theUser.save();
        }).then(result => {
            res.redirect('/login');
        }).catch(err => {
            console.log(err);
        });
};