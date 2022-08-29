const express = require("express");
const mongoose=require("mongoose");
const app = express();
const router = express.Router();
const categoryController = require("../controller/categories");
const { toTitleCase } = require("../config/function");
const productModel = require("../models/products");
const categoryModel = require("../models/categories");
const userModel = require("../models/users");
const walletModel = require("../models/wallets");
const { debitAccount, creditAccount } = require("../controller/transaction");
const fs = require("fs");
const multer = require("multer");
const alert = require("alert");
const prompt = require("prompt");
const bodyParser = require("body-parser");
const orderModel = require("../models/orders");
const transactionModel = require("../models/transactions");
const supplyModel = require("../models/supply");
const { v4 } = require("uuid");
const { nextTick } = require("process");
const bcrypt=require("bcryptjs");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/supplier",async(req,res)=>{
    try{
    const accountnumber="12434";
    const wallet=await walletModel.findOne({username:accountnumber});
    console.log(wallet);
    res.render("supplier",{wallet});
    }
    catch(err){
        console.log(err);
    }
})




module.exports=router;