// const adminData = require('./products');
const Product = require('../models/product');

exports.getProducts = (req,res, next)=>{
    Product.fetchAll()
    .then((products)=>{
        res.render('shop/product-list', {
            pageTitle:'Shop',
            path:'/shop', 
            prods:products,
            hasProduct:products.length>0,
        });
    })
    .catch(err=>{
        console.log(err);
    });
};

exports.getProductsList = (req, res, next)=>{
    Product.fetchAll()
    .then((products)=>{
        res.render('shop/index', {
            pageTitle:'Home',
            path:'/product-list', 
            prods:products,
            hasProduct:products.length>0,
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
exports.deleteCart = ((req,res, next)=>{
    const prodId = req.body.productId;
   req.user.deleteItem(prodId)
   .then(()=>{
       res.redirect('/cart');
   }).catch(err=>{
       console.log(err);
   });
});

exports.getCart = (req, res, next)=>{
    return req.user.getCart()
    .then(products =>{
        console.log(products);
        res.render('shop/cart', {
            pageTitle:'Cart',
            path:'/cart',
            products:products
        });
    }).catch(ere=>console.log(err));
    
};
// exports.getCreateOrder =(req, res, next)=>{
//     req.user.getOrders({include:['products']})
//     .then(orders=>{
//         res.render('shop/check-out', {
//             path:'/create-order',
//             pageTitle:'Orders',
//             orders:orders,
//         });
//     })
//     .catch(err=>{
//         console.log(err);
//     });
   
// };
exports.createOrder = (req, res, next)=>{
   return req.user. addOrder()
   .then(()=>{
       res.redirect('/create-orders')
   });
}
//     .then(products=>{
//         return req.user.createOrder()
//         .then(order=>{
//             return order.addProducts(
//                 products.map(product=>{
//                     product.orderItem = {quantity:product.cartItem.quantity};
//                     return product;
//                 })
//             );
//         }).catch(err=> console.log(err));
//     })
//     .then(()=>{
//         return fetchCart.setProducts(null);
//     })
//     .then(()=>{
//         res.redirect('/create-order');
//     })
//     .catch(err=>console.log(err));
// };

exports.getProductDetail = (req, res, next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product=>{
        console.log(product);
        res.render('shop/product-detail', {
            pageTitle:'product-detail',
            path:'/product-list', 
            prod:product,
        });
    })
    .catch(err =>{
        console.log(err);
    });
    
};