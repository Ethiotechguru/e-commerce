
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin=(req,res, next)=>{
    res.render('auth/login', {
        path:'/login',
        pageTitle:'Log In',
        isAuthenticated:false,
    });
};

exports.postLogin=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
        .then(doMatch=>{
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                return res.redirect('/');
            }  
            res.redirect('/login');
        });
    }).catch(err=>{
        console.log(err);
       });
};
exports.getSignUp=(req,res, next)=>{
    res.render('auth/signup', {
        path:'/signup',
        pageTitle:'Sign Up',
        isAuthenticated:false,
    });
};


exports.postSignUp=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
   User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){
            return res.redirect('/login');
        }
        return bcrypt.hash(password, 12)
        .then(hashPassword=>{
            const user = new User({
                email:email,
                password:hashPassword,
                cart:{items:[]},
            });
            return user.save();
        })
    }).then(result=>{
        res.redirect('/login');
    }).catch(err=>{
        console.log(err);
    });
};

exports.postLogout = (req, res, next)=>{
    req.session.destroy((err)=>{
        console.log(err);
        
        res.redirect('/login');
    });
}