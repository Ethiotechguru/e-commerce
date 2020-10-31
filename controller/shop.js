// const adminData = require('./products');
const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req,res, next)=>{
    Product.find().sort({createdAt: -1})
    .then((products)=>{
        res.render('shop/product-list', {
            pageTitle:'Shop',
            path:'/shop', 
            prods:products,
            hasProduct:products.length>0,
            isAuthenticated:req.session.isLoggedIn,
            csurfToken :req.csrfToken()
        });
    })
    .catch(err=>{
        console.log(err);
    });
};

exports.getProductsList = (req, res, next)=>{
    Product.find().sort({createdAt: -1})
    .then((products)=>{
        res.render('shop/index', {
            pageTitle:'Home',
            path:'/product-list', 
            prods:products,
            hasProduct:products.length>0,
            isAuthenticated:req.session.isLoggedIn,
        });
    })
    .catch(err =>{
        console.log(err);
    });
};
exports.postCart = (req, res, next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product=>{
        return req.user.addToCart(product);
    }).then(result=>{
        res.redirect('/cart');
    }).catch(err=>{
        console.log(err);
    });
};
exports.deleteCart = (req,res, next)=>{
    const prodId = req.body.productId;
  return req.user.deleteItem(prodId)
   .then(()=>{
       res.redirect('/cart');
   }).catch(err=>{
       console.log(err);
   });
};


//passing product to cart ejs and rendering the cart view
exports.getCart = (req, res, next)=>{
    return req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
        const products = user.cart.items;
        res.render('shop/cart', {
            pageTitle:'Cart',
            path:'/cart',
            products:products,
            isAuthenticated:req.session.isLoggedIn,
        });
    }).catch(err=>console.log(err));
    
};
exports.getCreateOrder =(req, res, next)=>{
    return Order.find({'user.userId':req.user._id})
    .then(orders=>{
    
        res.render('shop/check-out', {
            path:'/create-order',
            pageTitle:'Orders',
            orders:orders,
            isAuthenticated:req.session.isLoggedIn,
        });
    })
    .catch(err=>{
        console.log(err);
    });
   
};
exports.createOrder = (req, res, next)=>{
    return req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
        const orderDate = new Date().toDateString();
        const products = user.cart.items.map(i=>{
            console.log(i);
            return {quantity:i.quantity, product:{...i.productId._doc}};
        });
        const order = new Order({
            user:{
                email:req.user.email,
                userId:req.user
            },
            products:products,
            orderDate:orderDate
        });
        return order.save();
   }).then(result=>{
       return req.user.clearCart();
   }).then(()=>{
       res.redirect('/create-order');
   }).catch(err=>{
       console.log(err);
   });
};

exports.getProductDetail = (req, res, next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product=>{
        res.render('shop/product-detail', {
            pageTitle:'product-detail',
            path:'/product-list',
            prod:product,
            isAuthenticated:req.session.isLoggedIn,
        });
    })
    .catch(err =>{
        console.log(err);
    });
    
};
exports.deleteOrder = (req,res, next)=>{
    const prodId = req.body.orderId;
    console.log(prodId);
    Order.findByIdAndDelete(prodId)
   .then(()=>{
       res.redirect('/create-order');
   }).catch(err=>{
       console.log(err);
   });
};