const express = require("express");
const router = express.Router();
const productController = require("../controller/products");
const multer = require("multer");
const productModel = require("../models/products");
const categoryModel = require("../models/categories");
const userModel = require("../models/users");
const orderModel = require("../models/orders");
const transactionModel = require("../models/transactions");
const walletModel = require("../models/wallets");
const {bcrypt}=require('bcryptjs');
const fs = require("fs");
const path = require("path");
const alert = require("alert")





module.exports=router;
  