// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let _db;

// const mongoConnect = (callback)=>{
//     MongoClient.connect('mongodb+srv://samuel:lidetBefekaduBelete@cluster0.fxxsk.mongodb.net/shop?retryWrites=true&w=majority', { useUnifiedTopology: true })
//         .then(client=>{
//             _db = client.db();
//             callback();
//         }).catch(err=>{
//             throw err;
//         });
// };

// const getDb = ()=>{
//     if(_db){
//         return _db;
//     }
//     throw 'No database found';
// };

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;
