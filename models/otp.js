const mongoose = require("mongoose");

const Schema = mongoose.Schema;


//otp send after forgot password
const userSchema = new Schema(
  {
    parentId: {type:String},
    email: { type: String, required: true },
    code: { type: String, required: true },
    expire_in: {
      type: Number,
      deafult: 0,
    },
    
  },
  { timestamps: true }
);

const Otp = mongoose.model("otp", userSchema,'otp');

module.exports = Otp;
