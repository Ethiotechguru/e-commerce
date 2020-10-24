
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



