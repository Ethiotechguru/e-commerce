// const adminData = require('./products');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const transport = require('nodemailer-sendgrid-transport');
const stripe = require('stripe')(process.env.SECRET_PAYMENT);
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEM_PER_PAGE = 3;

const transporter = nodemailer.createTransport(transport({
    auth:{
        api_key:process.env.MAILER_SECRET,
    }
}));

exports.getProducts = (req,res, next)=>{
    const page = +req.query.page || 1;
    let totalItems;
    Product.find()
    .countDocuments()
    .then(numProducts=>{
        totalItems = numProducts;
        return Product.find().sort({createdAt: -1})
        .skip((page-1)*ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then((products)=>{
        res.render('shop/product-list', {
            pageTitle:'Shop',
            path:'/shop', 
            prods:products,
            hasProduct:products.length>0,
            currentPage:page,
            hasNextPage:ITEM_PER_PAGE*page <totalItems,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage:page-1,
            lastPage:Math.ceil(totalItems/ITEM_PER_PAGE)
        });
    })
    .catch(err=>{
        console.log(err);
    });
};

exports.getProductsList = (req, res, next)=>{
    const page = +req.query.page || 1;
    let totalItems;
    Product.find()
    .countDocuments()
    .then(numProducts=>{
        totalItems = numProducts;
        return Product.find().sort({createdAt: -1})
        .skip((page-1)*ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then((products)=>{
        res.render('shop/index', {
            pageTitle:'Home',
            path:'/product-list', 
            prods:products,
            hasProduct:products.length>0,
            currentPage:page,
            hasNextPage:ITEM_PER_PAGE*page <totalItems,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage:page-1,
            lastPage:Math.ceil(totalItems/ITEM_PER_PAGE)
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
        
        });
    }).catch(err=>console.log(err));
    
};
exports.getCreateOrder =(req, res, next)=>{
    return Order.find({'user.userId':req.user._id})
    .sort({createdAt:-1})
    .then(orders=>{
    
        res.render('shop/orders', {
            path:'/create-order',
            pageTitle:'Orders',
            orders:orders,
        });
    })
    .catch(err=>{
        console.log(err);
    });
   
};
exports.getCheckout = (req, res, next)=>{
    let products;
    let total = 0;
    return req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
        products = user.cart.items;
        total = 0;
        products.forEach(product=>{
            total += product.quantity * product.productId.price;
        });
        return stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:products.map(p=>{
                return{
                    name:p.productId.title,
                    description:p.productId.description,
                    amount:p.productId.price*100,
                    currency:'usd',
                    quantity:p.quantity
                };
            }),
            success_url:req.protocol+'://'+req.get('host')+'/checkout/success',
            cancel_url:req.protocol+'://'+req.get('host')+'/checkout/cancel',
        }).then(session=>{
            res.render('shop/checkout', {
                pageTitle:'checkout',
                path:'/checkout',
                products:products,
                totalSum:total,
                sessionId:session.id
            });
        });
    }).catch(err=>console.log(err));
};
exports.createOrder = (req, res, next)=>{
    let userEmail;
    return req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
        userEmail = user.email;
        const orderDate = new Date().toDateString();
        const products = user.cart.items.map(i=>{
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
       return transporter.sendMail({
           to:userEmail,
           from:'samyethio891@gmail.com',
           subject:'Thank You for shopping with Us',
           html:"<h3>Order Confirmation</h3><p>Thank your for your order. we will notify you when your orders is shipped</p>"
       }).catch(err=>{
           console.log(err);
       });
   }).catch(err=>{
       console.log(err);
   });
};

exports.getProductDetail = (req, res, next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product=>{
        if(!product){
            res.redirect('/')
        }
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

exports.getInvoice = (req, res, next)=>{
    const orderId = req.params.orderId;
    Order.findById(orderId).then(order=>{
        console.log(order);
        if(!order){
            return next(new Error('No order is found'));
        }
        if(order.user.userId.toString() !== req.user._id.toString()){
            return next(new Error('Unauthorized User'));
        }
        const invoiceName = 'invoice-'+orderId+'.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 
            'inline;filename="'+ invoiceName + '"'
        );
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text('Invoice',{
            underline:true,
        });
        pdfDoc.fontSize(15).text('Order Number: ' + order._id)
        pdfDoc.text('Date Ordered: ' + order.orderDate)
        pdfDoc.text('************************');
        order.products.forEach(prod=>{
            pdfDoc.fontSize(12).text(`
                ${prod.product.title} - quantity: ${prod.quantity} x $ ${prod.product.price}
            `);
        });
        pdfDoc.text('------------------------------------------------------------------------------');
       let sum = order.products.reduce((a, b)=>{
            return a + (b.quantity * b.product.price);
        }, 0);
        pdfDoc.text(`
            Total: $${sum}
        `);
        pdfDoc.end();
        
    }).catch(err=>{
        console.log(err);
    });
    
}