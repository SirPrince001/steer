require("dotenv").config();
const Driver = require("../models/driver");
const jwt = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");
const Mongoose = require("mongoose");

//create new driver
exports.createDriver = async (request, response) => {
  // check if driver already exist
  let existingDriver = await Driver.findOne({
    vehicleNumber: request.body.vehicleNumber,
  });
  if (existingDriver) {
    return response.status(422).json({
      success: false,
      responseMessage: `Sorry driver with this vehicle number ${existingDriver.vehicleNumber} exist`,
    });
  } else {
    // accept driver's data
    let {
      firstname,
      lastname,
      phone,
      email,
      password,
      vehicleNumber,
      vehicleModel,
    } = request.body;
    // hash the password
    password = Bcrypt.hashSync(request.body.password, 10);
    let newDriver = new Driver({
      firstname,
      lastname,
      phone,
      email,
      password,
      vehicleNumber,
      vehicleModel,
    });
    let driverData = await newDriver.save();
    driverData = driverData.toJSON();
    delete driverData.password;

    // create a driver payload
    const payload = {
      firstname: driverData.firstname,
      lastname: driverData.lastname,
      phone: driverData.phone,
      email: driverData.email,
      vehicleNumber: driverData.vehicleNumber,
      vehicleModel: driverData.vehicleModel,
    };
    const driverToken = jwt.sign(payload, process.env.SECRET);
    return response.status(200).json({
      success: true,
      responseMessage: { driverData: driverData, driverToken: driverToken },
    });
  }
};

//login
exports.loginDriver = async (request, response) => {
  let driverEmail = await Driver.findOne({ email: request.body.email });
  //check if driver's email exist
  if (!driverEmail)
    return response.status(422).json({
      success: false,
      responseMessage: `No driver with such email ${driverEmail.email} please try again`,
    });

  if (
    driverEmail &&
    Bcrypt.compareSync(request.body.password, driverEmail.password)
  ) {
    return response
      .status(200)
      .json({
        success: true,
        responseMessage: ` You have ${driverEmail.email} successfully login`,
      });
  } else {
    return responseMessage
      .status(422)
      .json({
        success: false,
        responseMessage: `Unable to login user with this email ${driverEmail.email}`,
      });
  }
};
