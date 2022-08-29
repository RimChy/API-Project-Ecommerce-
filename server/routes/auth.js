const express = require("express");
const router = express.Router();
const app = express();
const hbs = require("hbs");
const bodyParser = require("body-parser");
const authController = require("../controller/auth");
const { loginCheck, isAuth, isAdmin } = require("../middleware/auth");
var urlencodedParser = app.use(bodyParser.urlencoded({ extended: false }));
const { toTitleCase, validateEmail } = require("../config/function");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const adminModel = require("../models/admin");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const categoryController = require("../controller/categories");
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const walletModel = require("../models/wallets");
const alert = require("alert");
const orderModel = require("../models/orders");
const supplyModel = require("../models/supply");

// app.set('views','../views');
// app.set('view engine','hbs');
router.get("/", async (req, res) => {
  console.log(req.session.firstName);

  try {
    let Categories = await categoryModel.find({}).sort({ _id: -1 });
    let Products = await productModel.find({}).sort({ _id: -1 });
    if(req.session.email){
      let userinfo=await userModel.findOne({email:req.session.email});
      console.log(req.session.uid,1);
    
    res.render("index", {
      error: req.session.error,
      id: req.session.uid,
      firstName: req.session.firstName,
      Categories: Categories,
      Products: Products,
      userinfo:userinfo,
      email:req.session.email
    });
  }
  else{
    res.render("index", {
      error: req.session.error,
      id: req.session.uid,
      firstName: req.session.firstName,
      Categories: Categories,
      Products: Products,
      email:req.session.email
    });
    
  }
  } catch (err) {
    console.log(err);
  }
});
router.get("/signin", (req, res) => {
  res.render("signin", {
    error: req.session.error,
    id: req.session.uid,
    firstName: req.session.firstName,
  });
  req.session.error = null;
});
router.get("/signup", (req, res) => {
  res.render("signup", { error: req.session.error });
  req.session.error = null;
});

router.get("/logout", (req, res) => {
  req.session.firstName = null;
  req.session.uid = null;
  req.session.email=null;

  res.redirect("/");
});

router.get("/single-product", (req, res) => {
  res.render("sample");
});

router.post("/isadmin", authController.isAdmin);

router.post("/signin", async (req, res) => {
  const contentType = req.get('Content-Type');
  console.log(1);
  const errors = [];
  console.log(req.body);
  console.log(2);
  let { email, password } = req.body;
  if (!email || !password) {
    req.session.error = "Fields must not be empty";
    if(contentType === 'application/json') {
    
      return res.json({error:req.session.error});
      
      }
    res.redirect("signin");
    req.session.error = null;
  }
  try {
    console.log(email);
    const data = await userModel.findOne({ email: email });
    if (!data) {
      req.session.error = "Invalid email or password";
      if(contentType === 'application/json') {
    
        return res.json({error:req.session.error});
        
        }
      res.redirect("signin");
      req.session.error = null;
    } else {
      const login = await bcrypt.compare(password, data.password);
      if (login) {
       
        
        req.session.success = "Successfully logged in";
        console.log(data._id);
        
        req.session.firstName = data.firstName;
        req.session.email=data.email;
        let userinfo = await userModel.findOne({email:req.session.email});
        req.session.uid = userinfo._id;
        let Categories = await categoryModel.find({}).sort({ _id: -1 });
        let Products = await productModel.find({}).sort({ _id: -1 });
        if(contentType === 'application/json') {
    
          return res.json({message:'Login Successful',userinfo});
          
          }
          console.log(req.session.uid,2);
        res.render("index", {
          error: req.session.error,
          id: req.session.uid,
          firstName: req.session.firstName,
          Categories: Categories,
          Products: Products,
          userinfo:userinfo,
          email:email
        });
        

        // res.render("index", {
        //   id: req.session.id,
        //   firstName: req.session.firstName,
        // });
      } else {
        req.session.error = "Invalid email or password";
        if(contentType === 'application/json') {
    
          return res.json({error:req.session.error,id:req.session.uid});
          
          }
        res.redirect("/signin");
        req.session.error = null;
      }
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/signup", async (req, res) => {
  console.log(req.body);
  let { firstName, lastName, email, password ,accountnumber,secretkey} = req.body;
  const contentType = req.get('Content-Type');

  console.log(1);
  if (validateEmail(email)) {
    firstName = toTitleCase(firstName);
    console.log(2);
    lastName = toTitleCase(lastName);
    if ((password.length > 255) | (password.length < 8)) {
      req.session.error = "Password must be 8 character";
      if(contentType === 'application/json') {
    
        return res.json({error:req.session.error});
        
        }
      res.redirect("signup");
    } else {
      // If Email & Number exists in Database then:
      try {
        password = bcrypt.hashSync(password, 10);
        secretkey = bcrypt.hashSync(secretkey,10);
        const data = await userModel.findOne({ email: email });
        if (data) {
          req.session.error = "Email already registered";
          if(contentType === 'application/json') {
    
            return res.json({error:req.session.error});
            
            }
          res.redirect("/signup");
        } else {
          let newUser = new userModel({
            firstName,
            lastName,
            email,
            password,
            accountnumber,
            secretKey:secretkey,
            // ========= Here role 1 for admin signup role 0 for customer signup =========
            userRole: 1, // Field Name change to userRole from role
          });
          let newwallet = new walletModel({
            username:accountnumber,
            secretkey:secretkey

          })
          newUser
            .save()
            .then((data) => {
              if(contentType === 'application/json') {
    
                return res.json({message:'Registration Successful',data});
                
                }
              req.session.uid = data._id;
              req.session.firstName = data.firstName;
              req.session.email=data.email;
              res.render("signup", {
                id: req.session.uid,
                firstName: req.session.firstName,
                email:req.session.email
              });
            })
            .catch((err) => {
              console.log(err);
            });
            newwallet.
            save().
            then((data)=>{

            })
            .catch((err)=>{
              console.log(err);
            })
        }
      } catch (err) {
        console.log(err);
      }
    }
  } else {
    req.session.error = "Email is not valid";
    if(contentType === 'application/json') {
    
      return res.json({error:req.session.error});
      
      }
    res.redirect("/signup");
  }
});
router.get("/admin-sign", (req, res) => {
  res.render("admin-sign", { error: req.session.error });
});
router.get("/admin",async (req, res) => {
  const totalorder=await orderModel.find();
  const products=await productModel.find();
  const categories=await categoryModel.find();
  const order=await orderModel.countDocuments({status:"Not processed"});
  const orderinfo=await orderModel.find({status:"Not processed"});
  const suppliedorder=await orderModel.find({status:"Supplied"});
  const shippedorder=await orderModel.find({status:"Shipped"});
  const deliveredorder=await orderModel.find({status:"Delivered"})
  const orderlength=order.length;
  if (!req.session.id1) {
    alert("You are not logged in");
    res.redirect("/admin-sign");
  }
  res.render("admin", { ida: req.session.id1 ,orderlength:orderlength,orderinfo:orderinfo,totalorder,products,categories,suppliedorder,shippedorder,deliveredorder});
});
router.post("/admin-signin", async (req, res) => {
  const contentType=req.get('Content-Type');
  let admin_email = "admin@gmail.com";
  let admin_password = bcrypt.hashSync("123admin@", 10);
  const data = await userModel.findOne({ email: admin_email });
  if (!data) {
    let newAdmin = new adminModel({
      email: admin_email,
      password: admin_password,
    });
    newAdmin
      .save()
      .then((data) => {})
      .catch((err) => {
        // res.json("Something is wrong")
        console.log(err);
        
      });
  }
  let { email, password } = req.body;
  const data1 = await adminModel.findOne({ email: email });
  if (!data1) {
    req.session.error = "Invalid email or password";
    if(contentType === 'application/json') {
    
      return res.json({error:'Invalid email or password'});
      
      }
    res.redirect("/admin-sign");
    req.session.error = null;
  } else {
    const login = await bcrypt.compare(password, data1.password);
    if (login) {
      const token = jwt.sign({ _id: data1._id }, JWT_SECRET);
      const encode = jwt.verify(token, JWT_SECRET);
      req.session.id1 = data1.id;
      if(contentType === 'application/json') {
    
        return res.json({message:'Admin login Successful',data1});
        
        }
        const order=await orderModel.countDocuments({status:"Not processed"});
        const orderinfo=await orderModel.find({status:"Not processed"});

        console.log(order);
        const orderlength=order;
      res.redirect("/admin");
    }
    else{
      req.session.error = "Invalid email or password";
    // res.json("Invalid email or pass")
    if(contentType === 'application/json') {
    
      return res.json({error:'Invalid email or password'});
      
      }
    res.redirect("/admin-sign");
    req.session.error = null;

    }
  }
});
router.get("/alogout", (req, res) => {
  req.session.id1 = null;
  req.session.uid=null;
  res.render("admin-sign");
});

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

router.get("/supplier-orders",async(req,res)=>{
  const orders=await supplyModel.find({}).sort({_id:-1});
  res.render("supplier-orders",{orders});
})

module.exports = router;
