const express = require("express");
const CourseSchema = require("../models/course.model");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();

const coursePicPath = "assets/images/courses";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, coursePicPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage }).single("picture");

//   add  course

router.post("/add", (req, res) => {
  upload(req, res, function (err) {
    const { name, addedBy, description } = req.body;
    const picture = req.file.filename;

    
    if (err instanceof multer.MulterError) {
      fs.unlink(coursePicPath + "/" + picture);
      res.status(500).json({ msg: err.message });
    } else if (err) {
      fs.unlink(coursePicPath + "/" + picture);
      res.status(501).json({ msg: err.message });
    }


    let insCourse = new CourseSchema({ name, addedBy, description, picture });

    insCourse
      .save()
      .then((result) => {
        res.status(200).json({ msg: "Course Added Successfully" });
      })
      .catch((err) => {
        res.status(400).json({ msg: err.message });
        fs.unlink(coursePicPath + "/" + picture);
      });
  });
});

// get all courses
router.get("/", (req, res) => {
  CourseSchema.find({}, (err, data) => {
    if (err) return res.status(502).json({ msg: err.message });
    if (data.length == 0)
      return res.status(200).json({ msg: "No Course Available" });
    res.status(200).json({ msg: data });
  });
});

module.exports = router;
