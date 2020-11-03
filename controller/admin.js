const Product = require('../models/product');


exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product', {
        pageTitle:'Add Product', 
        path:'admin/add-product',
        editing:false,
        
    });
};

exports.postAddProduct =  (req, res, next)=>{
    const title = req.body.title;
    const price = req.body.price;
    const imgUrl = req.body.imageUrl;
    const desc = req.body.description;
    
    const product = new Product(
        {
            title:title,
            price:price,
            imageUrl:imgUrl,
            description:desc,
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
            
         });
     })
     .catch(err=> console.log(err));
};
exports.postEditProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    Product.findById(prodId)
    .then(product=>{
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/');
        }
        product.title=updatedTitle;
        product.price=updatedPrice;
        product.imageUrl=updatedImageUrl;
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
    Product.deleteOne({_id:prodId, userId:req.user._id})
    .then(()=>{
         res.redirect('/admin/products');
     })
     .catch(err=>{
         console.log(err);
     });
};



