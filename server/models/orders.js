const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
  {
    allProduct: [
      {
        id: { type: ObjectId, ref: "products" },
        quantity: Number,
        pName:String,
        amount:Number,
        pImage:String,
        pCategory:String
        
      },
    ],
    name:{
      type:String,
      required:true,
    },
    user: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    orderno:{
      type : Number,
      required:true
    },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Supplied",
        "Shipped",
        "Delivered",
      ],
    },
    transactionIds:{
      type:String,
      default:'0'
    },
date:{
  type:String
},

  },
  { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);
module.exports = orderModel;
