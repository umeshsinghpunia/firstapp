const express=require('express');
require('dotenv').config();
const mongoose=require('mongoose');
const cors=require('cors')

const {PORT,DB_USER,DB_PASS}=process.env;

// variables
const app=express();
const port=PORT || 8001;


// middleware
app.use(express.json())
app.use("/",express.static("public"));
app.use(cors())
app.use('/images', express.static('assets/images')) 

// db connection

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.ubiz5.mongodb.net/ecomproject?retryWrites=true&w=majority`,(err)=>{
    if(err) return console.log(err)
    console.log(`db is connected`)
})


// routes
app.use("/api/admin/user/",require('./routes/user.routes'))

app.use("/api/admin/course/",require('./routes/course.routes'))
app.use("/api/admin/single-course/",require('./routes/single-course.routes'))
app.use("/api/front/",require('./routes/front.routes'))


// server 
app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})