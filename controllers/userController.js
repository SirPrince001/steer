require("dotenv").config();
const User = require("../models/user");
const UserLocation = require("../models/userLocation");
const request = require("request");
const jwt = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");
const Mongoose = require("mongoose");

// create a new user

exports.createUser = async (request, response) => {
  // check if user email exist before creating user
  let existingUser = await User.findOne({ email: request.body.email });
  if (existingUser) {
    return response.status(422).json({
      success: false,
      responseMessage: `User with this enail ${existingUser.email} already exist`,
    });
  } else {
    let { firstname, lastname, password, email, phone } = request.body;
    password = Bcrypt.hashSync(request.body.password, 10);
    let newUser = new User({
      firstname,
      lastname,
      password,
      email,
      phone,
    });
    let userData = await newUser.save();
    userData = userData.toJSON();
    delete userData.password;

    //create a payload
    const payload = {
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      phone: userData.phone,
    };

    const userToken = jwt.sign(payload, process.env.SECRET);
    return response
      .status(200)
      .json({ success: true, userPayload: payload, userToken: userToken });
  }
};

// login user with  email and passowrd

exports.login = async (request, response) => {
  // check if user email exist

  let userEmail = await User.findOne({ email: request.body.email });
  if (!userEmail)
    return response.status(422).json({
      success: failed,
      responseMessage: `No User with this email${userEmail}`,
    });

  if (
    userEmail &&
    Bcrypt.compareSync(request.body.password, userEmail.password)
  ) {
    return response.status(200).json({
      success: true,
      responseMessage: `You have ${userEmail.email} login successfully`,
    });
  } else {
    return response.status(422).json({
      success: failed,
      responseMessage: ` No User with such email ${userEmail}`,
    });
  }
};

exports.editUser = async (request, response) => {
  let { firstname, lastname, email, password, phone } = request.body;

  let userId = request.body.params;
  if (!Mongoose.isValidObjectId(userId))
    return response
      .status(422)
      .json({ success: false, responseMessage: `Invalid user id ${userId}` });
  try {
    //get a user by id and update the data
    let editedUser = await User.findByIdAndUpdate(
      { userId },
      { firstname, lastname, email, password, phone },
      { new: true }
    );
    return response
      .status(200)
      .json({ success: true, responseMessage: editedUser });
  } catch (error) {
    return responseMessage.status(422).json({
      success: false,
      responseMessage: `Unable to get a user due to this error ${error.message}`,
    });
  }
};

// locate user for pick up
exports.findUserForPickUp = function (request, response) {
  let api_key = process.env.API_KEY;
  let base_url = process.env.BASE_URL;
  let { address } = request.body.address;
  let url = base_url + address + "&key=" + api_key;

  request(url, function(error, body) {
    if (!error && response.status == 200) {
      console.log(body);
      return response.json({
        success: true,
        responseMessage: body,
      });
    } else {
      return response.status(422).json({
        success: false,
        responseMessage: `Cannot loaction use this address ${address}`,
      });
    }
  });
};
