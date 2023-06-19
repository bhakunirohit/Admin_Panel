const mongoose = require("mongoose");

const Schema = mongoose.Schema;


//collection for user creating during registration
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_verified: {
      type: Number,
      deafult: 0,
    }
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
