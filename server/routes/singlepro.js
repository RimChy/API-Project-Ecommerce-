const express = require("express");
const router = express.Router();
const productController = require("../controller/products");
const multer = require("multer");
const productModel = require("../models/products");
const categoryModel = require("../models/categories");
const fs = require("fs");
const path = require("path");
const alert = require("alert")


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });







module.exports = router;
