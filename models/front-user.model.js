const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    registrationOn:{
        type:Date,
        default:Date.now()
    }
})



module.exports=mongoose.model('front_user',UserSchema);