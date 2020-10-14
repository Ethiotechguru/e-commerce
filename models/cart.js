const Sequelize = require('sequelize');// the core module sequelize object
const sequelize = require('../util/database');//data base utility function

const Cart = sequelize.define('cart', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },

});

module.exports = Cart;