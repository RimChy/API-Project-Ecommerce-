/* 

================== Most Important ==================
* Issue 1 :
In uploads folder you need create 3 folder like bellow.
Folder structure will be like: 
public -> uploads -> 1. products 2. customize 3. categories
*** Now This folder will automatically create when we run the server file

* Issue 2:
For admin signup just go to the auth 
controller then newUser obj, you will 
find a role field. role:1 for admin signup & 
role: 0 or by default it for customer signup.
go user model and see the role field.

*/

const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser=require("body-parser");
const cors = require("cors");
const expressSession=require('express-session');
const fileupload = require("express-fileupload");
const SESS_NAME='sid';
const multer = require("multer")
// const hbs =require('hbs');
// const path = require('path');

// const SESS_TIME=2*14*24*60*60*1000;

// Import Router
const category = require("./routes/category");
const delcategoryRouter= require("./routes/del-category");
const productRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const singleproRouter = require("./routes/singlepro");
// Import Auth middleware for check user login or not~
const { loginCheck } = require("./middleware/auth");
const CreateAllFolder = require("./config/uploadFolderCreateScript");

/* Create All Uploads Folder if not exists | For Uploading Images */
CreateAllFolder();

// Database Connection
mongoose
  .connect(process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    console.log(
      "==============Mongodb Ecommerce Database Connected Successfully=============="
    )
  )
  .catch((err) => console.log("Database Not Connected !!!",err));




// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
// app.use(fileupload())
app.use(express.static("public"));
// app.use('/css',express.static(__dirname+ 'public/css'));
// app.use('/js',express.static(__dirname+ 'public/js'));
// app.use('/images',express.static(__dirname+ 'public/images'));
// app.use('/uploads',express.static(__dirname+'public/uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressSession({
  name:SESS_NAME,
  secret:"max",
  saveUninitialized:true,
  resave:false,
  cookie:{
      

  }
}));

// const { loginCheck } = require("../middleware/auth");
// const urlencodedParser= bodyParser.urlencoded({ extended: false });

// Image Upload setting
// hbs.registerPartials(path.join(__dirname, '../views/partials'))
app.set('views','../views');
app.set('view engine','hbs');
app.engine('html', require('ejs').renderFile);
app.use("/",category);
app.use("/",delcategoryRouter);
app.use("/", authRouter);
app.use("/", productRouter);
app.use("/",singleproRouter);


// app.use("/", categoryRouter);






// app.get("/product",(req,res)=>{
//   console.log(req.session.pid);
//   // res.render("product",{firstName:req.session.firstName,id:req.session.pid})
  
// })


// Run Server

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
