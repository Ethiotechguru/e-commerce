exports.getErrorPage = (req, res, next)=>{
    res.status(404).render('404', {pageTitle:'Page Not Found', path:'/tt', isAuthenticated:req.session.isLoggedIn,});
};