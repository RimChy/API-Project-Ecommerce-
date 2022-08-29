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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

// router.get("/product", (req, res) => {
//   console.log(req.params);
//   res.render("product", {
//     firstName: req.session.firstName,
//     id: req.session.pid,
//   });
// });
router.get("/product/:id", async (req, res) => {
  console.log(req.params.id);
  req.session.pid = req.params.id;
  req.session.reviewexits = null;
  uId = req.session.id;
  // res.redirect("/product");
  let userinfo = null;
  const contentType = req.get("Content-Type");

  let singleproduct = await productModel.findById(req.params.id);
  
  let sum=0;
  if(singleproduct.pRatingsReviews.length){
  singleproduct.pRatingsReviews.map(item=>{
    sum=sum+item.rating;

  })
  sum=(sum/singleproduct.pRatingsReviews.length).toFixed(1);
  console.log(Math.round(sum));

  await productModel.findByIdAndUpdate(req.params.id,{pRating:Math.round(sum)});}
  if (contentType === "application/json") {
    return res.json({ singleproduct });
  }

  console.log(singleproduct);
  if (req.session.email) {
    userinfo = await userModel.findOne({ email: req.session.email });
    console.log(userinfo);
    if (userinfo.cart.length > 0) {
      console.log(1);
      userinfo.cart.map((item) => {
        console.log(item._id);
        console.log(req.params.id);
        if (item.pName == singleproduct.pName) {
          res.render("product-added", {
            firstName: req.session.firstName,
            singleproduct: singleproduct,
            pId: req.params.id,
            email: req.session.email,
            uId: req.params.id,
            review: req.session.reviewexits,
            userinfo: userinfo,
          });
        }
      });
    }
  }

  res.render("product", {
    firstName: req.session.firstName,
    singleproduct: singleproduct,
    pId: req.params.id,
    email: req.session.email,
    uId: req.params.id,
    review: req.session.reviewexits,
    userinfo: userinfo,
  });
});
router.get("/product/added-to-cart/:id",async(req,res)=>{
  res.redirect("/product/added-to-cart/"+req.params.id+"/"+req.session.email);
})
router.get("/product/added-to-cart/:id/:email", async (req, res) => {
  const contentType = req.get("Content-Type");
  console.log(req.params.id);
  req.session.pid = req.params.id;
  console.log(req.session.id);
  req.session.reviewexits = null;
  uId = req.session.id;
  email = req.params.email;
  let flag = 1;
  // res.redirect("/product");
  let singleproduct = await productModel.findById(req.params.id);
  let sum=0;
  if(singleproduct.pRatingsReviews.length){
    singleproduct.pRatingsReviews.map(item=>{
      sum=sum+item.rating;
  
    })
    sum=(sum/singleproduct.pRatingsReviews.length).toFixed(1);
    console.log(Math.round(sum));
  
    await productModel.findByIdAndUpdate(req.params.id,{pRating:Math.round(sum)});}
  let userinfo = await userModel.findOne({ email: email });
  if (userinfo.cart.length > 0) {
    userinfo.cart.map((item) => {
      console.log(item.pName == singleproduct.pName);
      if (item.pName == singleproduct.pName) {
        flag = 0; $('#nav-bar1').addClass('container');
      }
    });
  }
  console.log(email);
  if (flag == 1) {
    console.log("added");
    let cart = userModel.findOneAndUpdate(
      { email: email },
      {
        $push: {
          cart: {
            pid: req.params.id,
            pPrice: singleproduct.pPrice,
            pCategory: singleproduct.pCategory,
            pImage1: singleproduct.pImage1,
            pName: singleproduct.pName,
            pQuantity: 1,
          },
        },
      }
    );
    cart.exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);

        userinfo.cart.length += 1;
        let a = userinfo.cart.length;
        console.log(userinfo.cart.length);
        if (contentType === "application/json") {
          return res.json({ success: "Item added to cart" });
        }
        res.render("product-added", {
          firstName: req.session.firstName,
          singleproduct: singleproduct,
          pId: req.params.id,
          email: req.session.email,
          uId: req.params.id,
          review: req.session.reviewexits,
          userinfo: userinfo,
        });
      }
    });
  } else {
    alert("Product already added to the cart");
    if (contentType === "application/json") {
      return res.json({ error: "Product already added to cart" });
    }
    res.redirect("/cart");
  }
});
router.get("/cart/:email", async (req, res) => {
  const contentType = req.get("Content-Type");
  email = req.params.email;
  console.log(req.session.firstName);
  let userinfo = await userModel.findOne({ email: email });
  if (contentType === "application/json") {
    return res.json({ Item: userinfo.cart.length, Cart: userinfo.cart });
  }

  res.render("cart", {
    pid: req.session.pid,
    id: req.session.id,
    userinfo: userinfo,
    firstName: req.session.firstName,
    email: email,
  });
});

router.post("/post-review", async (req, res) => {
  const contentType = req.get("Content-Type");
  console.log(req.body);
  let { uId, pId, email, rating, review } = req.body;
  req.session.reviewexits = null;
  console.log(pId, uId, rating, review, req.session.email);
  console.log(1);
  let userinfo = await userModel.findOne({ email: email });
  console.log(userinfo.firstName);

  let checkReviewRatingExists = await productModel.findOne({ email: email });
  console.log(checkReviewRatingExists);
  
  

  try {
    let newRatingReview = productModel.findByIdAndUpdate(pId, {
      $push: {
        pRatingsReviews: {
          review: review,
          user: uId,
          rating: rating,
          firstName: userinfo.firstName,
          lastName: userinfo.lastName,
        },
      },
    });
    newRatingReview.exec((err, result) => {
      if (err) {
        console.log(err);
      }
      // return res.json({ success: "Thanks for your review" });
      
      
      if (contentType === "application/json") {
        return res.json({ message: "Review Successful" });
      }

      res.redirect("/product/" + uId);
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Cart product wrong" });
  }
});

router.get("/categories/:id", async (req, res) => {
  console.log(req.params.id);
  const cId = req.params.id;
  try {
    let deletedCategoryFile = await categoryModel.findById(cId);
    const filePath = `./public/uploads/categories/${deletedCategoryFile.cImage}`;

    let deleteCategory = await categoryModel.findByIdAndDelete(cId);
    
    if (deleteCategory) {
      // Delete Image from uploads -> categories folder
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        alert("Category Deleted Successfully");
        res.redirect("/categories");
      });
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/dlt-product", async (req, res) => {
  const contentType = req.get("Content-Type");
  let pName = req.body.pName;
  if (req.session.email) {
    email = req.session.email;
  } else {
    email = req.body.email;
  }
  try {
    let userinfo = await userModel.findOneAndUpdate(
      { email: email },
      {
        $pull: {
          cart: { pName: pName },
        },
      }
    );
    if (contentType == "application/json") {
      return res.json({ message: "Item deleted from cart successfully" });
    }
    res.redirect("/cart/" + email);
  } catch (err) {
    console.log(err);
  }
});

router.post("/add-category", upload.single("cImage"), async (req, res) => {
  let { cName, cStatus } = req.body;
  let cImage = req.file.filename;
  console.log(cImage);
  const filePath = `./public/uploads/categories/${cImage}`;

  cName = toTitleCase(cName);
  try {
    let checkCategoryExists = await categoryModel.findOne({ cName: cName });
    if (checkCategoryExists) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        req.session.error = "Category already exists";
        req.session.error = null;
        alert("Category Already Exists");
        res.redirect("categories");

        // return res.json({ error: "Category already exists" });
      });
    } else {
      let newCategory = new categoryModel({
        cName,
        cStatus,
        cImage,
      });
      await newCategory.save((err) => {
        if (!err) {
          req.session.success = "Category created successfully";
          req.session.success = null;
          alert("Category created successfully");
          res.redirect("categories");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// router.post("/delete-category",upload.single('cImage'),async (req,res)=>{
//   let { cId } = req.body.cid;
//   console.log(cId);
//   // if (!cId) {
//   //   return res.json({ error: "All filled must be required" });
//   // } else {
//   //   try {
//   //     let deletedCategoryFile = await categoryModel.findById(cId);
//   //     const filePath = `./public/uploads/categories/${deletedCategoryFile.cImage}`;

//   //     let deleteCategory = await categoryModel.findByIdAndDelete(cId);
//   //     if (deleteCategory) {
//   //       // Delete Image from uploads -> categories folder
//   //       fs.unlink(filePath, (err) => {
//   //         if (err) {
//   //           console.log(err);
//   //         }
//   //         return res.json({ success: "Category deleted successfully" });
//   //       });
//   //     }
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // }
// });

router.get("/categories/edit/:id", async (req, res) => {
  console.log(req.params.id);
});

router.post("/edit-category/:id", upload.single("cImage"), async (req, res) => {
  let { cName, cStatus, cid } = req.body;
  console.log(req.params.id);
  let cImage = req.file.filename;
  const filePath = `./public/uploads/categories/${cImage}`;

  console.log(cName);
  console.log(req.file);

  try {
    let editCategory = categoryModel.findByIdAndUpdate(cid, {
      cName,
      cStatus,
      cImage,
      updatedAt: Date.now(),
    });
    let edit = await editCategory.exec();
    if (edit) {
      alert("Category edited successfully");
      res.redirect("/categories");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/add-product", upload.any(), async (req, res) => {
  let { pName, pDescription, pPrice, pQuantity, pCategory, pStatus } = req.body;
  let { image1 } = req.files[0];
  let { image2 } = req.files[1];
  let { image3 } = req.files[2];
  let { image4 } = req.files[3];
  const filePath1 = `./public/uploads/categories/${image1}`;
  const filePath2 = `./public/uploads/categories/${image2}`;
  const filePath3 = `./public/uploads/categories/${image3}`;
  const filePath4 = `./public/uploads/categories/${image4}`;
  // console.log(req.files[0].filename)

  // Validation
  console.log(pCategory);

  try {
    let newProduct = new productModel({
      pImage1: req.files[0].filename,
      pImage2: req.files[1].filename,
      pImage3: req.files[2].filename,
      pImage4: req.files[3].filename,
      pCategory,
      pName,
      pDescription,
      pPrice,
      pQuantity,
      pStatus,
    });
    let save = await newProduct.save();
    if (save) {
      alert("Product Created Successfully.");
      res.redirect("/products-admin");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/edit-product", upload.any(), async (req, res) => {
  let { pId, pName, pDescription, pPrice, pQuantity, pCategory, pStatus } =
    req.body;
  let editImages = req.files;
  console.log(pId);
  console.log(req.files);
  const filePath1 = `./public/uploads/categories/${req.files[0].filename}`;
  const filePath2 = `./public/uploads/categories/${req.files[1].filename}`;
  const filePath3 = `./public/uploads/categories/${req.files[2].filename}`;
  const filePath4 = `./public/uploads/categories/${req.files[3].filename}`;

  let editData = {
    pName,
    pDescription,
    pPrice,
    pQuantity,
    pCategory,
    pImage1: req.files[0].filename,
    pImage2: req.files[1].filename,
    pImage3: req.files[2].filename,
    pImage4: req.files[3].filename,
    pStatus,
  };

  try {
    let editProduct = productModel.findByIdAndUpdate(pId, editData);
    editProduct.exec((err) => {
      if (err) console.log(err);
      alert("Product Edited Successfully");
      res.redirect("/products-admin");
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/orders/:status", async (req, res) => {
  try{
  
  
   let order = await orderModel.find().sort({_id:-1});
  if(req.params.status=="supplied"){
    order=await orderModel.find({status:"Supplied"});
  }else if(req.params.status=="shipped"){
    order=await orderModel.find({status:"Shipped"})
  }
  else if(req.params.status=="delivered"){
      order=await orderModel.find({status:"Delivered"});
  }
  else if(req.params.status=="Notprocessed"){
   order=await orderModel.find({status:"Not processed"})
  }
  console.log(order);
   orderinfo=await orderModel.find({status:"Not processed"});

  res.render("orders", { order,orderinfo });
}
catch(err){
  console.log(err);
}
});
router.get("/singleorder/:id", async (req, res) => {
  const contentType=req.get('Content-Type');
  id = req.params.id;
  const order = await orderModel.findById(id);
  const orderinfo=await orderModel.find({status:"Not processed"});
  (a = null), (b = null), (c = null), (d = null), (e = null),enot=null,tnot=null;
  if (order.status == "Not processed") a = 1;
  else if (order.status == "Supplied") b = 1;
  else if (order.status == "Shipped") c = 1;
  else d = 1;

  if (order.transactionIds != "0") e = 1;
  else enot=1;
  console.log(order.transactionIds);
  const supply = await supplyModel.find({
    transactionId: order.transactionIds,
  });
  t = null;
  if (supply.length>=1) t = 1;
  else tnot=1
  console.log(t);
  console.log(supply);
  if(contentType=='application/json'){
    return res.json({orderInfo:order});
  }
  res.render("singleorder", {
    order: order,
    a: a,
    b,
    c,
    d,
    e,
    t,
    enot,
    tnot,
    subtotal: order.amount - 80,
    orderinfo
  });
});
router.post("/payto-supplier", async (req, res) => {
  const contentType=req.get('Content-Type');
  const { accountnumber, amount, reference } = req.body;
  const secretkey=req.body.secretkey;
  const order = await orderModel.findOne({ transactionId: reference });
  const toUsername = "12434";
  const reference1 = v4();
  console.log(order._id);
  try {
    const wallet=await walletModel.findOne({username:accountnumber});
    const wallet1=await walletModel.findOne({username:toUsername});

    if(await bcrypt.compare(secretkey,wallet.secretkey)){
      const updatedWallet=await walletModel.findOneAndUpdate({username:accountnumber},{balance:wallet.balance-Number(amount)})
      const updatedWallet1=await walletModel.findOneAndUpdate({username:toUsername},{balance:wallet1.balance+Number(amount)})
 
    const transferResult = await Promise.all([
      debitAccount({
        amount,
        username: accountnumber,
        purpose: "transfer",
        reference: reference1,
        orderno: order.orderno,
        trnxSummary: `TRFR TO: ${toUsername}. TRNX REF:${reference1} `,
      }),
      creditAccount({
        amount,
        username: toUsername,
        purpose: "transfer",
        reference: reference1,
        orderno: order.orderno,
        trnxSummary: `TRFR FROM: ${accountnumber}. TRNX REF:${reference1} `,
      }),
    ]);
    const transactionIds = reference1;
    const order1 = await orderModel.findByIdAndUpdate(order._id, {
      transactionIds,
    });
    if(contentType=='application/json'){
      return res.json({success:'Successfully paid to supplier',TransactionId:reference1,amount:amount})
    }

    alert("Payment successful");
    res.redirect("/singleorder/" + order._id);
  }else{
    alert("Secret pin is wrong!Try again");
    res.redirect("/singleorder/"+order._id);
  }
  } catch (err) {
    alert("Something is wrong!");
    console.log(err);
  }


});
router.post("/request", async (req, res) => {
  const contentType=req.get('Content-Type');
  const tid = req.body.tid;
  const reference = req.body.reference;
  console.log(tid);
  const transaction = await transactionModel.find({
    reference: tid,
    trnxType: "CR",
  });
  const order = await orderModel.findOne({ transactionId: reference });
  if (transaction) {
    const supply = new supplyModel({
      allProduct: order.allProduct,
      transactionId: tid,
      amount: order.amount - 80,
      orderno: order.orderno,
    });
    supply
      .save()
      .then((data) => {
        console.log(data);
       
      })
      .catch((err) => {
        if(contentType == 'application/json'){
          return res.json({error:"Something is wrong"});
        }
        console.log(err);
      });
      if(contentType == 'application/json'){
        return res.json({success:"Supplier accepts your request",allProduct:order.allProduct})
      }
     
    res.redirect("/singleorder/" + order._id);
  }
});

router.post("/save-order", async (req, res) => {
  const contentType=req.get('Content-Type');
  const { id, status } = req.body;
  console.log(status);
  const order = await orderModel.findByIdAndUpdate(id, { status: status });
  console.log(order);
  if(contentType == 'application/json'){
    return res.json({success:"Status updated",orderno:order.orderno,status:status});
  }
  res.redirect("/singleorder/" + id);
});

router.post("/delete-order",async (req,res) =>{
  const contentType=req.get("Content-Type");
  console.log(req.body);
  const id=mongoose.Types.ObjectId(req.body.id);
  console.log(id);
  const order = await orderModel.findByIdAndDelete(id);
  if(contentType=='application/json'){
    return res.json({success:"Order deleted successfully"});
  }
  res.redirect("/orders");

})

router.get("/user-order/:id",async (req,res)=>{
  const contentType=req.get('Content-Type');
  console.log(req.params.id);
  const user = await userModel.findById(req.params.id); 
  const email=user.email;
  console.log(email);
  const orders = await orderModel.find({user:email}).sort({_id:-1});
  console.log(orders);
  if(contentType=='application/json'){
    return res.json({orders:orders});
  }
  res.render("user-orders",{orders,id:req.params.id,firstName:req.session.firstName,email:req.session.email,user});
})

router.get("/user-single-order/:id",async(req,res)=>{
  const contentType=req.get("Content-Type");
  id=req.params.id;
  const order=await orderModel.findById(id);
  const subtotal=order.amount-80
  console.log(order);
  const userinfo=await userModel.findOne({email:req.session.email});
  if(contentType=='application/json'){
    return res.json({order:order});
  }

  res.render("user-single-order",{order,subtotal,firstName:req.session.firstName,email:req.session.email,userinfo,id:req.session.uid});
})

router.get("/user/profile",async(req,res)=>{
  const email=req.session.email;
  const profile=await userModel.findOne({email:email});

res.render("profile",{email:req.session.email,profile,firstName:req.session.firstName})
})

router.get("/user/bank",async(req,res)=>{
  const email=req.session.email;
  const profile=await userModel.findOne({email:email});
  const wallet=await walletModel.findOne({username:profile.accountnumber});

res.render("bank",{email:req.session.email,profile,firstName:req.session.firstName,wallet})
})
module.exports = router;
