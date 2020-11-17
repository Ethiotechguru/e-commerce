const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products:[
        {
            product:{type:Object, require:true},
            quantity:{type:Number, require:true}
        }
    ],
    user:{
        email:{
            type:String,
            require:true,
        },
        userId:{
            type:Schema.Types.ObjectId,
            require:true,
            ref:'User'
        }
    },
    orderDate:{
        type:Schema.Types.String,
        require:true
    }
},{timestamps:true});
module.exports = mongoose.model('Order', orderSchema);