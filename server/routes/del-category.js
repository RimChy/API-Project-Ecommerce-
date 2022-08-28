const express = require("express");
const app = express();
const multer = require("multer")
app.set('view engine','hbs');
const categoryModel = require("../models/categories");
const router = express.Router();
const fs = require('fs');
const alert = require('alert')

// router.get("/categories",(req,res)=>{
//     res.render("categories");
// })





module.exports=router;
  
