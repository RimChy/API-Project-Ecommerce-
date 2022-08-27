const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    pDescription: {
      type: String,
      required: true,
    },
    pPrice: {
      type: Number,
      required: true,
    },
    pSold: {
      type: Number,
      default: 0,
    },
    pQuantity: {
      type: Number,
      default: 0,
    },
    pCategory: {
      type: String,
      required:true,
    },
    pImage1: {
      type: String,
      required: true,
    },
    pImage2: {
      type: String,
      required: true,
    },
    pImage3: {
      type: String,
      required: true,
    },
    pImage4: {
      type: String,
      required: true,
    },
    // pOffer: {
    //   type: String,
    //   default: null,
    // },
    pRating:{
      type:Number,
      required:true,
      default:0.0,
    },
    pRatingsReviews: [
      {
        review: String,
        user: String,
        rating: Number,
        firstName:String,
        lastName:String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    pStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
