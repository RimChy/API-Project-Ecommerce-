const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
   
    email: {
      type: String,
      required: true,
      trim: true,
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    password: {
      type: String,
      required: true,
    },
},
  { timestamps: true }
);

const adminModel = mongoose.model("admin", userSchema);
module.exports = adminModel;
