const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');
require('dotenv').config();

const app = express();

const MONGODB_URL = process.env.MONGO_URL;
const store = new MongoDBStore({
    uri:MONGODB_URL,
    collection:'session'
});

const csurfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'images');
    },
    filename:(req, file, cb)=>{
        let fNSplit = new Date().toISOString().split('.')[0].split(':');
        let fName = fNSplit.join('_');
        cb(null, fName+ '_' + file.originalname);
    }
});
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

app.set('view engine', 'ejs');//what view engine used
app.set('views', 'views');//where to find the files(path) default if the folder name is views

const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const loginRoute = require('./routes/auth');
const errorRoute = require('./routes/404');





app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('imageUrl'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store}));
app.use(flash());
app.use( csurfProtection);

app.use((req, res, next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=>{
        if(!user){
            return next();
        }
        req.user=user;
        next();
    }).catch(err=>{
        console.log(err);
    });
});

app.use((req, res, next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn,
    res.locals.csrfToken =req.csrfToken(),
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoute);
app.use(loginRoute);
app.use('/', errorRoute);


mongoose.connect(MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true  })
.then(result=>{
    app.listen(process.env.PORT, process.env.HOST);
}).catch(err=>{
    console.log(err);
});
