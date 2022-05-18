const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password:{
        type:String,
        required:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone:{
        type:String,
        required:true
    },
    address: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = Mongoose.model("User", userSchema);
