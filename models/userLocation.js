const Mongoose = require("mongoose");

let userLocationSchema = new Mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("UserLocation", userLocationSchema);
