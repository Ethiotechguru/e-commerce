const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();


const MONGODB_URL = 'mongodb+srv://samuel:lidetBefekaduBelete@cluster0.fxxsk.mongodb.net/shop';
const store = new MongoDBStore({
    uri:MONGODB_URL,
    collection:'session'
});

const User = require('./models/user');



app.set('view engine', 'ejs');//what view engine used
app.set('views', 'views');//where to find the files(path) default if the folder name is views

const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const loginRoute = require('./routes/auth');
const errorRoute = require('./routes/404');
// const product = require('./models/product');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store}));

app.use((req, res, next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=>{
        req.user=user;
        next();
    }).catch(err=>{
        console.log(err);
    });
});
app.use('/admin', adminRoutes);
app.use(shopRoute);
app.use(loginRoute);
app.use('/', errorRoute);


mongoose.connect(MONGODB_URL)
.then(result=>{
    User.findOne().then(user=>{
        if(!user){
            const user = new User({
                name:'Samuel',
                email:'samy@gmail.com',
                cart:{
                    items:[]
                }
            });
            user.save();
        }
    });

    app.listen(3000);
}).catch(err=>{
    console.log(err);
});
