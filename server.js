const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.set('view engine', 'ejs');//what view engine used
app.set('views', 'views');//where to find the files(path) default if the folder name is views

const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const errorRoute = require('./routes/404');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findByPk(1).then(user=>{
        req.user = user;
        next();
    }).catch(err=>console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoute);
app.use('/', errorRoute);


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through:CartItem});
Product.belongsToMany(Cart, {through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through:OrderItem});

sequelize.sync()
.then(product => {
    return User.findByPk(1);
}).then(user=>{
    if(!user){
        return User.create({name:'Samuel', email:'samy@gmail.com'});
    }
    return user;
}).then(user=>{
    return user.createCart();
}).then(cart=>{
    // console.log(cart);
    app.listen(3000);
})
.catch(err => console.log(err));