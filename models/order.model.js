const mongoose=require('mongoose');

const OrderSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    cid:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    orderDate:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:String,
        default:"pending"
    }
})



module.exports=mongoose.model('order',OrderSchema);