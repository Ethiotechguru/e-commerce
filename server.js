const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');


const app = express();

const MONGODB_URL = 'mongodb+srv://<name>:<password>@cluster0.fxxsk.mongodb.net/<dbName>';
const store = new MongoDBStore({
    uri:MONGODB_URL,
    collection:'session'
});

const csurfProtection = csrf();



app.set('view engine', 'ejs');//what view engine used
app.set('views', 'views');//where to find the files(path) default if the folder name is views

const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const loginRoute = require('./routes/auth');
const errorRoute = require('./routes/404');





app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store}));
app.use(flash());
app.use( csurfProtection);

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
    app.listen(3000);
}).catch(err=>{
    console.log(err);
});
