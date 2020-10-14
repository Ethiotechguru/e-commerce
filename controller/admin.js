const Product = require('../models/product');
exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product', {
        pageTitle:'Add Product', 
        path:'admin/add-product',
        editing:false
    });
};

exports.postAddProduct =  (req, res, next)=>{
    const title = req.body.title;
    const price = req.body.price;
    const imgUrl = req.body.imgUrl;
    const desc = req.body.description;
    req.user.createProduct({
        title:title,
        price:price,
        imageUrl:imgUrl,
        description:desc,
    })
    .then(()=>{
       res.redirect('/admin/products');
    }).catch(err=>{
        console.log(err);
    });
};


exports.getEditProduct = (req, res, next)=>{
    const editMode = req.query.edit;
    console.log(editMode , 'is this');
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    req.user.getProducts({where:{id:prodId}})
     .then(products=>{
         const product = products[0];
         if(!product){
             return res.redirect('/');
         }
         res.render('admin/edit-product', {
            pageTitle:'Edit Product',
            path:'/edit-product',
            editing:editMode,
            product: product
         });
     })
     .catch(err=> console.log(err));
};

exports.postEditProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imgUrl;
    const updatedDesc = req.body.description;
    Product.findByPk(prodId)
    .then(product=>{
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        return product.save();
    }).then(result=>{
        console.log("product Updated");
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
};

exports.adminProducts =(req,res, next)=>{
    req.user.getProducts()
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
    Product.findByPk(prodId)
     .then(product=>{
         return product.destroy();
     })
     .then(()=>{
         res.redirect('/admin/products');
     })
     .catch(err=>{
         console.log(err);
     });
};


