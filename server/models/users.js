const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 32,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: { unique: true },
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    password: {
      type: String,
      required: true,
    },
    userRole: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    userImage: {
      type: String,
      default: "user.png",
    },
    verified: {
      type: String,
      default: false,
    },
    accountnumber:{
      type:String,
      default:null,
    },
    secretKey: {
      type: String,
      default: null,
    },
    history: {
      type: Array,
      default: [],
    },
    wishlist:[
      {
        pid:{ObjectId},
        pPrice:Number,
        pCategory:String,
        pImage1:String,
        pName:String
      }
    ],
    cart:[
      {
        pid:{ObjectId},
        pPrice:Number,
        pCategory:String,
        pName:String,
        pImage1:String,
        pQuantity:Number
      }
    ]
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
