const express = require("express");
const router = express.Router();
const productController = require("../controller/products");
const {creditAccount,debitAccount}=require("../controller/transaction");
const multer = require("multer");
const productModel = require("../models/products");
const categoryModel = require("../models/categories");
const userModel = require("../models/users");
const orderModel = require("../models/orders");
const walletModel = require("../models/wallets");
const transactionModel = require("../models/transactions");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const alert = require("alert");
const { v4 } = require('uuid');  
const {mongoose}=require('mongoose');
const { hashSync } = require("bcryptjs");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/update-product",async(req,res)=>{
  const contentType=req.get('Content-Type');
  let {pName,pQuantity}=req.body;
  console.log(req.body.pQuantity)
  if(req.session.email){
  email=req.session.email;
  }
  else{
    email=req.body.email;
  }
  try{
  let product = await userModel.updateMany({email:email},
    {$set : { 'cart.$[element].pQuantity' : pQuantity}},
    {arrayFilters: [{'element.pName':pName}]});
    if(contentType == 'application/json'){
      return res.json({success:'Quantity Updated'});
    }
 console.log(product);
  }
  catch(err){
    console.log(err);
  }
})


// router.get("/product",(req,res)=>{
//   res.render("product");
// })
// router.get("/product/:id",(req,res)=>{
//   console.log(req.params.id);
//   res.render("product",{firstName:req.session.firstName});
// })

router.get('/checkout/:email',async(req,res)=>{
  const userinfo = await userModel.findOne({email:req.params.email})
  var subtotal=0;
  userinfo.cart.map((item)=>{
     subtotal+= item.pQuantity*item.pPrice;
  })
  console.log(subtotal);
  var total=subtotal+80;
  res.render('checkout',{firstName:req.session.firstName,email:req.session.email,userinfo:userinfo,subtotal:subtotal.toFixed(2),total:total.toFixed(2)});
})
router.get("/categories", async (req, res,next) => {
  // console.log("hello")
  try {
    let Categories = await categoryModel.find({});
    
    const orderinfo=await orderModel.find({status:"Not processed"});
      
    if (Categories) {
      res.render("categories", {
        error: req.session.error,
        success: req.session.success,
        categories: Categories,
        orderinfo
      });
    }
  } catch (err) {
    next(err);
    console.log(err);
  }
});
router.get("/products-admin",async (req,res)=>{
  // res.render("products-admin");
  try {
    let Categories = await categoryModel.find({});
    const orderinfo=await orderModel.find({status:"Not processed"});
    let Products = await productModel
      .find({});
      console.log(Products)
      
    
      res.render("products-admin",{categories:Categories,products:Products,orderinfo})
    
    
  } catch (err) {
    console.log(err);
  }
  
  
})
// router.get("/admin-product",(req,res)=>{
//   res.render("admin-product");
// })
router.get("/:id",async (req,res)=>{
  // console.log(req.params.id);
  _id=req.params.id;
  const orderinfo=await orderModel.find({status:"Not processed"});

  let Categories = await categoryModel.find({});
  let singleproduct= await  productModel.findById(_id);
  console.log(singleproduct);
  
  res.render("admin-product",{id:req.params.id,singleproduct:singleproduct,categories:Categories,orderinfo});

})

router.get("/admin-product",async (req,res)=>{
  console.log(singleproduct);
  const orderinfo=await orderModel.find({status:"Not processed"});
  res.render("admin-product",{id:_id,singleproduct:singleproduct,orderinfo});
})

router.get("/checkout2",(req,res)=>{
  
  res.render("checkout2");
})
router.post("/checkout",async (req,res)=>{
  const contentType=req.get('Content-Type');
  console.log(req.body);
  const reference=v4();
  const fromUsername=req.body.accountnumber;
  const name=req.body.name;
  const amount=req.body.amount;
  const toUsername="134784";
  const secretKey=req.body.secretkey;
  const orderno=Math.floor(Math.random()* (100000000-100+1) + 100);
  const address=req.body.address;
  const phone=req.body.mnumber;
  if(contentType == 'application/json'){
    email=req.body.email;
  }
  else{
    email=req.session.email;
  }

  try{
  const wallet = await walletModel.findOne({ username:fromUsername });
  const wallet1 = await walletModel.findOne({username:toUsername});
  
  console.log(wallet);
  console.log(wallet1);
  let transaction=new transactionModel({
    trnxType:'CR',
    purpose:'transfer',
    amount:Number(amount),
    walletUsername:fromUsername,
    reference:reference,
    balanceBefore:wallet.balance,
    balanceAfter:wallet.balance-Number(amount),
    trnxSummary:`TRFR TO: ${toUsername}. TRNX REF:${reference}`

  })
  transaction.save().
  then((data)=>{
    console.log(data);
  })
  .catch(err=>{
    console.log(err);
  })

  let transaction1=new transactionModel({
    trnxType:'DR',
    purpose:'transfer',
    amount:Number(amount),
    walletUsername:toUsername,
    reference:reference,
    balanceBefore:wallet.balance,
    balanceAfter:wallet.balance+Number(amount),
    trnxSummary:`TRFR FROM: ${fromUsername}. TRNX REF:${reference}`

  })
  transaction1.save().
  then((data)=>{
    console.log(data);
  })
  .catch(err=>{
    console.log(err);
  })
  var date=new Date();
  const dt=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  console.log(dt);
let order=new orderModel({
  user:email,
  amount:Number(amount),
  transactionId:reference,
  address:req.body.address,
  phone:req.body.mnumber,
  orderno:orderno,
  date:dt,
  name:name
  
})
order.save().
then((data)=>{
  console.log(data)
})
.catch(err=>{
  console.log(err);
})
console.log(req.session.email);
const userinfo = await userModel.findOne({email:email});
userinfo.cart.map((item)=>{


const orderinfo=orderModel.findOneAndUpdate({transactionId:reference},{
  $push:{
    allProduct: {
       id:item._id,
       quantity:item.pQuantity,
       pName:item.pName,
       pImage:item.pImage1,
       amount:item.pPrice*item.pQuantity,
       pCategory:item.pCategory,
    }
  }
})
orderinfo.exec((err,result)=>{
  if(err){
    console.log(err)
  }
})
const user=userModel.findOneAndUpdate({email:email},{
  $pull:{
    cart:{
      
    }
  }
})
user.exec((err,result)=>{
  if(err){
    console.log(err)
  }

})
var date = new Date();
var last = new Date(date.getTime() + (7 * 24 * 60 * 60 * 1000));
var day =last.getDate();
var month=last.getMonth()+1;
var year=last.getFullYear();
console.log(day,month,year);
if(contentType == 'application/json'){
  return res.json({success:'Order is placed',transactionId:reference,amount:amount});
}
res.render("checkout2",{reference:reference,orderno:orderno,email:req.session.email,amount:Number(amount)-80,total:amount,address:address,phone:phone,day:day,month:month,year:year})

})


}
catch(err){
  console.log(err);
}
})
router.post("/del-product",async(req,res)=>{
  const contentType=req.get('Content-Type');
  _id=req.body.id;
  console.log(_id);
  let deleteproduct = await productModel.findByIdAndDelete(_id);
  if(deleteproduct){
    alert("Product Deleted Successfully");
    if(contentType == 'application/json'){
      return res.json({success:"Product deleted Successfully"});
    }
    res.redirect("/products-admin")
  }
  else{
    if(contentType == 'application/json'){
      return res.json({error:"Something is wrong"});
    }
    console.log("Something is wrong");
  }

})

router.post("/edit-product",upload.any(),async(req,res)=>{
  let {
    pId,
    pName,
    pDescription,
    pPrice,
    pQuantity,
    pCategory,
    pStatus,
    
  } = req.body;
  let editImages = req.files;
  console.log(pId);
  console.log(req.files)


    let editData = {
      pName,
      pDescription,
      pPrice,
      pQuantity,
      pCategory,
      pImage1:req.files[0].filename,
      pImage2:req.files[1].filename,
      pImage3:req.files[2].filename,
      pImage4:req.files[3].filename,
      pStatus,
    };
    
    try {
      let editProduct = productModel.findByIdAndUpdate(pId, editData);
      editProduct.exec((err) => {
        if (err) console.log(err);
        return res.json({ success: "Product edited successfully" });
      });
    } catch (err) {
      console.log(err);
    }
})



// router.post("/",async (req, res) =>{
//   let { pId, uId, rating, review } = req.body;
//   if (!pId || !rating || !review || !uId) {
//     return res.json({ error: "All filled must be required" });
//   } else {
//     let checkReviewRatingExists = await productModel.findOne({ _id: pId });
//     if (checkReviewRatingExists.pRatingsReviews.length > 0) {
//       checkReviewRatingExists.pRatingsReviews.map((item) => {
//         if (item.user === uId) {
//           return res.json({ error: "Your already reviewd the product" });
//         } else {
//           try {
//             let newRatingReview = productModel.findByIdAndUpdate(pId, {
//               $push: {
//                 pRatingsReviews: {
//                   review: review,
//                   user: uId,
//                   rating: rating,
//                 },
//               },
//             });
//             newRatingReview.exec((err, result) => {
//               if (err) {
//                 console.log(err);
//               }
//               return res.json({ success: "Thanks for your review" });
//             });
//           } catch (err) {
//             return res.json({ error: "Cart product wrong" });
//           }
//         }
//       });
//     } else {
//       try {
//         let newRatingReview = productModel.findByIdAndUpdate(pId, {
//           $push: {
//             pRatingsReviews: { review: review, user: uId, rating: rating },
//           },
//         });
//         newRatingReview.exec((err, result) => {
//           if (err) {
//             console.log(err);
//           }
//           return res.json({ success: "Thanks for your review" });
//         });
//       } catch (err) {
//         return res.json({ error: "Cart product wrong" });
//       }
//     }
//   }
// }





module.exports = router;
