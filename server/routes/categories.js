const express = require("express");
const router = express.Router();
// const bodyParser= require("body-parser")
const categoryController = require("../controller/categories");
const multer = require("multer");
// const { loginCheck } = require("../middleware/auth");
// const urlencodedParser= bodyParser.urlencoded({ extended: false });

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

// router.get("/categories", (req,res)=>{
//   res.render("categories");
// });
// // router.post(
// //   "/add-category",
// //   upload.single("cImage"),
// //   categoryController.postAddCategory
// // );
// router.post("/add-category",upload.single("cImage"),(req,res)=>{
//   console.log(req.body);
//   console.log(req.file)
//   // let cImage = req.file.filename;
  
//   // const filePath = `../server/public/uploads/categories/${cImage}`;
// })



// router.post("/edit-category", loginCheck, categoryController.postEditCategory);
// router.post(
//   "/delete-category",
//   loginCheck,
//   categoryController.getDeleteCategory
// );

module.exports = router;
