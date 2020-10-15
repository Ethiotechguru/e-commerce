const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

app.set('view engine', 'ejs');//what view engine used
app.set('views', 'views');//where to find the files(path) default if the folder name is views

const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const errorRoute = require('./routes/404');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findById("5f87f138be56cd17a659df3b").then(user=>{
        req.user = user;
        next();
    }).catch(err=>console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoute);
app.use('/', errorRoute);

mongoConnect(()=>{
    
    app.listen(3000);
});
