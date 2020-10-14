const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-complete', 'root', 'Samuel@belete', {
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;



// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'node-complete',
//     password:'Samuel@belete'
// });
// module.exports = pool.promise();