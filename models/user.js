const mongodb = require('mongodb');
const ObjId = mongodb.ObjectId;
const getDb = require('../util/database').getDb;

class User {
    constructor(userName, email, cart, id) {
        this.name = userName;
        this.email = email;
        this.cart = cart;//
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users')
            .insertOne(this);
    }

    addToCart(product) {

        let indexOfCp = this.cart.items.findIndex(cp => {
            return cp.prodId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if (indexOfCp >= 0) {
            newQuantity = updatedCartItems[indexOfCp].quantity + 1;
            updatedCartItems[indexOfCp].quantity = newQuantity;
        }
        else {
            updatedCartItems.push({ prodId: new ObjId(product._id), quantity: newQuantity });
        }
        const updatedCart = { items: updatedCartItems };
        const db = getDb();
        return db.collection('users')
            .updateOne({ _id: new ObjId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }
    getCart() {
        const db = getDb();
        const prodsId = this.cart.items.map(i => {
            return i.prodId;
        });
        return db.collection('products')
            .find({ _id: { $in: prodsId } }).toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p, quantity: this.cart.items.find(i => {
                            return i.prodId.toString() === p._id.toString();
                        }).quantity
                    };
                });
            });
    }
    static findById(userId) {
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new ObjId(userId) });
    }
    deleteItem(prodId){
        const updatedCart = this.cart.items.filter(item=>{
            return item.prodId.toString() !== prodId.toString();
        });
       const db = getDb();
       return db.collection('users')
       .updateOne({_id:new ObjId(this._id)}, {$set:{cart:{items:updatedCart}}});
    }
    addOrder(){
        const db = getDb();
        return db.collection('orders')
        .insertOne(this.cart)
        .then(result=>{
            this.cart = {items:[]};
            return db.collection('users')
            .updateOne({_id:new ObjId(this._id)}, {$set:{items:[]}});
        })
    }
}
module.exports = User;


