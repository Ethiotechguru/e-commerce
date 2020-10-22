const User = require('../models/user');
exports.getLogin=(req,res, next)=>{
    res.render('auth/login', {
        path:'/login',
        pageTitle:'Log In',
        isAuthenticated:false,
    });
};

exports.postLogin=(req,res,next)=>{
    
    User.findById("5f8ea3cad49e544af05077cd")
    .then(user=>{
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err=>{
            res.redirect('/')
        });
    });
};

exports.postLogout=(req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    });
};