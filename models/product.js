const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    title:Sequelize.STRING,
    price:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = Product;



// exports.Product = class Product{
//     constructor(title, price, imgUrl, desc){
//         this.title = title;
//         this.price = price;
//         this.imgUrl = imgUrl;
//         this.desc = desc;
//         this.id = Math.random().toString();
//     }
//     save(){
//         return db.execute('INSERT INTO products(title, price, imageUrl, description) VALUES(?, ?, ?, ?)',
//         [this.title, this.price, this.imgUrl, this.desc]);
//     }
//     static fetchAll(){
//       return db.execute('SELECT * FROM products');
//     }
//     static findById(id){
//         return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//     }
// };

// exports.products = products;