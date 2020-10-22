
const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    cart:{
        items:[
            {
                productId:{type:Schema.Types.ObjectId, ref:'Product', require:true}, 
                quantity:{type:Number, require:true}
            }
        ]
    }
});
userSchema.methods.addToCart = function(product){
    let indexOfCp = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    // let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (indexOfCp >= 0) {
        // newQuantity = this.cart.items[indexOfCp].quantity+1;
        updatedCartItems[indexOfCp].quantity++;//newQuantity;
    }
    else {
        updatedCartItems.push({ productId: product._id, quantity:1 });
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
};
userSchema.methods.deleteItem = function(prodId){
    const updatedCart = this.cart.items.filter(item=>{
        return item._id.toString() !== prodId.toString();
    });
    this.cart.items = updatedCart;
    return this.save();
};
userSchema.methods.clearCart = function(){
    this.cart = {items:[]};
    return this.save();
};
module.exports = mongoose.model("User", userSchema);
// const mongodb = require('mongodb');
// const ObjId = mongodb.ObjectId;
// const getDb = require('../util/database').getDb;

// class User {
//     constructor(userName, email, cart, id) {
//         this.name = userName;
//         this.email = email;
//         this.cart = cart;//
//         this._id = id;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users')
//         .insertOne(this);
//     }

//     addToCart(product) {
//         let indexOfCp = this.cart.items.findIndex(cp => {
//             return cp.prodId.toString() === product._id.toString();
//         });
//         // let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//         if (indexOfCp >= 0) {
//             // newQuantity = 
//             updatedCartItems[indexOfCp].quantity++;
//             // updatedCartItems[indexOfCp].quantity = newQuantity;
//         }
//         else {
//             updatedCartItems.push({ prodId: new ObjId(product._id), quantity:1 /*newQuantity*/ });
//         }
//         const updatedCart = { items: updatedCartItems };
//         const db = getDb();
//         return db.collection('users')
//             .updateOne({ _id: new ObjId(this._id) },
//                 { $set: { cart: updatedCart } }
//             );
//     }
//     getCart() {
//         const db = getDb();
//         const prodsId = this.cart.items.map(i => {
//             return i.productId;
//         });
        
//         return db.collection('products')
//             .find({ _id: { $in: prodsId } }).toArray()
//             .then(products => {
//                 return products.map(p=>{
//                     return {...p, quantity:this.cart.items.find(i=>{
//                             return p._id.toString() === i.productId.toString();
//                         }).quantity
//                     };
//                 });

//             });
//     }
//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users')
//             .findOne({ _id: new ObjId(userId) });
//     }
//     deleteItem(prodId){
//         const updatedCart = this.cart.items.filter(item=>{
//             return item.prodId.toString() !== prodId.toString();
//         });
//        const db = getDb();
//        return db.collection('users')
//        .updateOne({_id:new ObjId(this._id)}, {$set:{cart:{items:updatedCart}}});
//     }
//     addOrder(){
//         const db = getDb();
//         return this.getCart()
//         .then(products=>{
//             const order = {
//                 items:products,
//                 orderDate:new Date().toDateString(),
//                 user:{
//                     _id:new ObjId(this._id),
//                     name:this.name
//                 }
//             }
//             return db.collection('orders').insertOne(order);
//         })
//         .then(result=>{
//             this.cart = {items:[]};
//             return db.collection('users')
//             .updateOne({_id:new ObjId(this._id)}, {$set:{cart:{items:[]}}});
//         });
//     }
//     getOrder(){
//         const db = getDb();
//         return db.collection('orders').find({"user._id":new ObjId(this._id)}).toArray();
//     }
// }
// module.exports = User;


