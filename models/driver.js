const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

// declear the car schema
let driverSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Driver", driverSchema);
