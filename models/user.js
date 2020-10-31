
const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:{
        type:String,
        require:true,
    },
    password:{
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
    const indexOfCp = this.cart.items.findIndex(i=>{
        return i.productId.toString() === product._id.toString();
    });
    
    let updatedCart = [...this.cart.items];
    if(indexOfCp!== -1){
        updatedCart[indexOfCp].quantity++;
    }else{
        updatedCart.push({productId:product._id, quantity:1});
    }
    this.cart.items = updatedCart;
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



