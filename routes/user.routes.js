const express = require("express");
const bcrypt = require("bcrypt");
const UserSchema = require("../models/user.model");

const router = express.Router();

// get all users
// router.get("/", (req, res) => {
//   res.send("all good");
// });

// add user
router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please Fill Fields" });
  }

  bcrypt.hash(password, 12, (err, hashPass) => {
    if (err) return res.status(501).json({ msg: err.message });
    if (!hashPass) return res.status(502).json({ msg: "Please Try Again" });

    let insUser = new UserSchema({ email, password: hashPass });

    insUser
      .save()
      .then((data) => {
        res.status(200).json({ msg: "User Added Successfully" });
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

router.get("/", (req, res) => {
  UserSchema.find({}, (err, data) => {
    if (err) return res.status(503).json({ msg: err.message });
    if (!data) return res.status(404).json({ msg: "Not Found" });
    if (data.length > 0) {
      res.status(200).json({ msg: data });
    } else {
      res.status(200).json({ msg: "Not Data" });
    }
  });
});

// update password
router.put("/password", (req, res) => {
  const { op, np, email } = req.body;

  if (!op || !np || !email) {
    res.json({ msg: "Please FIll Fields" });
  }

  UserSchema.findOne({ email }, (err, data) => {
    if (err) return res.json({ msg: err.message });
    if (!data) return res.json({ msg: "Please Try Again" });

    // match op with database
    bcrypt.compare(op, data.password, (err, valid) => {
      if (err) return res.json({ msg: err.message });
      if (!valid) return res.json({ msg: "Something Wrong" });

      // password match with db password
      bcrypt.hash(np, 12, (err, hashPass) => {
        if (err) return res.json({ msg: err.message });
        if (!hashPass) return res.json({ msg: "Not Converted" });

        // password hashed
        UserSchema.findOneAndUpdate(
          { email },
          { password: hashPass },
          (err, result) => {
            if (err) return res.json({ msg: err.message });
            if (!result) return res.json({ msg: "Not Updated" });
            res.json({msg:"Password Changed Successfully"})
          }
        );
      });
    });
  });
});

module.exports = router;
