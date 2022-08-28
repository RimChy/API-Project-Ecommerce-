const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const supplySchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    orderno:{
      type : Number,
      required:true
    },
    

  },
  { timestamps: true }
);

const supplyModel = mongoose.model("supply", supplySchema);
module.exports = supplyModel;
