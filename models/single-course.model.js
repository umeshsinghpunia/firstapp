const mongoose=require('mongoose');

const CourseSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    picture:{
        type:String,
        required:true
    },
    addedBy:{
        type:String
    },
    description:{
        type:String,
        required:true
    },
    addedOn:{
        type:Date,
        default:Date.now()
    },
    price:{
        type:Number,
        required:true
    },
    course:{
        type:String,
        required:true
    }
})



module.exports=mongoose.model('single',CourseSchema);