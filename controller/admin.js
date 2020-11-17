const Product = require('../models/product');
const {validationResult} = require('express-validator');
const fileDeleteHandler = require('../util/unlinkFile');
exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product', {
        pageTitle:'Add Product', 
        path:'admin/add-product',
        editing:false,
        msg:null,
        oldInput:{
            title:'',
            price:'',
            imgUrl:'',
            description:null
        },
        valErr:[]
        
    });
};

exports.postAddProduct =  (req, res, next)=>{
    const title = req.body.title;
    const price = req.body.price;
    const image = req.file;
    const description = req.body.description;
    const errors = validationResult(req);
    if(!image){
        return res.status(422).render('admin/edit-product', {
            pageTitle:'Add Product', 
            path:'admin/add-product',
            editing:false,
            msg:'Attached file is not an Image',
            oldInput:{
                title:title,
                price:price,
                // imageUrl:imageUrl,
                description:description
            },
            valErr:[]
        });
    }
    const imageUrl = image.path;
    if(!errors.isEmpty()){
        return res.render('admin/edit-product', {
            pageTitle:'Add Product', 
            path:'admin/add-product',
            editing:false,
            msg:errors.array()[0].msg,
            oldInput:{
                title:title,
                price:price,
                imageUrl:imageUrl,
                description:description
            },
            valErr:errors.array()
        });
    }
    const product = new Product(
        {
            title:title,
            price:price,
            imageUrl:imageUrl,
            description:description,
            userId:req.session.user._id
        });
    product.save()
    .then((result)=>{
       res.redirect('/admin/products');
    }).catch(err=>{
        console.log(err);
    });
};


exports.getEditProduct = (req, res, next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
     .then(product=>{
         if(!product){
             return res.redirect('/');
         }
         res.render('admin/edit-product', {
            pageTitle:'Edit Product',
            path:'/edit-product',
            editing:editMode,
            product: product,
            msg:'',
            oldInput:{
                title:'',
                price:'',
                imgUrl:'',
                desc:''
            },
            valErr:[]
         });
     })
     .catch(err=> console.log(err));
};
exports.postEditProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDesc = req.body.description;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render(`admin/edit-product`, {
            pageTitle:'Edit Product',
            path:'/edit-product',
            editing:true,
            product:{
                title:updatedTitle,
                price:updatedPrice,
                description:updatedDesc,
                _id:prodId
            },
            msg:errors.array()[0].msg,
            valErr:errors.array()
         });
    }
   
    Product.findById(prodId)
    .then(product=>{
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/');
        }
        product.title=updatedTitle;
        product.price=updatedPrice;
        if(image){
            fileDeleteHandler.deleteFile(product.imageUrl);
            product.imageUrl=image.path;
            
        }
        product.description=updatedDesc;
        return product.save()
        .then(result=>{
            res.redirect('/admin/products');
        }).catch(err=>{
            console.log(err);
        });
    })
    .catch(err=>console.log(err));
};

exports.adminProducts =(req,res, next)=>{
    Product.find({userId:req.user._id}).sort({createdAt: -1})
    .then((products)=>{
        res.render('admin/products', {
            pageTitle:'Admin Products',
            path:'/admin-product',
            prods:products,
            hasProduct:products.length>0,
            
        });
    }).catch(err => console.log(err));
};
exports.postDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId).then(product=>{
        if(!product){
            return next(new Error('product not found!'));
        }
        fileDeleteHandler.deleteFile(product.imageUrl);
        return Product.deleteOne({_id:prodId, userId:req.user._id})
    }) .then(()=>{
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log(err);
    });
};



