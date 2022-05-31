const express = require("express");
const CourseSchema = require("../models/course.model");
const SingleSchema=require("../models/single-course.model");
const UserSchema=require("../models/front-user.model");
const OrderSchema=require("../models/order.model");
const bcrypt=require('bcrypt')

const router = express.Router();

// get all courses
router.get("/courses", (req, res) => {
  CourseSchema.find({}, (err, data) => {
    if (err) return res.status(502).json({ msg: err.message });
    if (data.length == 0)
      return res.status(200).json({ msg: "No Course Available" });
    res.status(200).json({ msg: data });
  });
});

// get single course
router.get("/course/:_id", (req, res) => {
  const { _id } = req.params;
  CourseSchema.findOne({ _id }, (err, data) => {
    if (err) return res.status(502).json({ msg: err.message });
    res.status(200).json({ msg: data });
  });
});


// get single course
router.get("/single/:_id", (req, res) => {
    const { _id } = req.params;
    SingleSchema.findOne({ _id }, (err, data) => {
      if (err) return res.status(502).json({ msg: err.message });
      res.status(200).json({ msg: data });
    });
});


// get singles using course id
router.get("/singles/:course", (req, res) => {
    // course id
    const { course } = req.params;
    SingleSchema.find({ course}, (err, data) => {
        if (err) return res.status(502).json({ msg: err.message });
        if (data.length == 0)
          return res.status(200).json({ msg: "No Single Available" });
        res.status(200).json({ msg: data });
    })
})

// registration

router.post("/signup", (req, res) => {
  const { email, password,name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ msg: "Please Fill Fields" });
  }

  bcrypt.hash(password, 12, (err, hashPass) => {
    if (err) return res.status(501).json({ msg: err.message });
    if (!hashPass) return res.status(502).json({ msg: "Please Try Again" });

    let insUser = new UserSchema({ email, password: hashPass,name });

    insUser
      .save()
      .then((data) => {
        res.status(200).json({ msg: "User Registered Successfully" });
      })
      .catch((err) => {
        return res.status(500).json({ msg: err.message });
      });
  });
});

// login

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please Fill Fields" });
  }

  UserSchema.findOne({ email }, (err, data) => {
    if (err) return res.status(501).json({ msg: err.message });
    if (!data) return res.status(502).json({ msg: "Something Wrong" });

    let dbPass = data.password;

    bcrypt.compare(password, dbPass, (err, valid) => {
      if (err) return res.status(503).json({ msg: err.message });
      if (!valid) return res.status(404).json({ msg: "Not Found" });
      res.status(200).json({ msg: email });
    });
  });
});


// place order
router.post("/order", (req, res) => {
  const { email, cid, price } = req.body;

  if (!email || !cid || !price) {
    return res.status(400).json({ msg: "Please Fill Fields" });
  }

  let insOrder = new OrderSchema({ email, cid, price });

  insOrder
    .save()
    .then((data) => {
      res.status(200).json({ msg: "Order Placed Successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ msg: err.message });
    });
})
router.put("/order/:_id",(req,res)=>{
  const {_id}=req.params;
  const {status}=req.body;
  OrderSchema.findOneAndUpdate({_id},{status},(err,data)=>{
    if(err) return res.status(500).json({msg:err.message});
    if(!data) return res.status(404).json({msg:"Not Found"});
    res.status(200).json({msg:"Order Status Updated"});
  })
})
module.exports = router;
