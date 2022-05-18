require("dotenv").config();
const User = require("../models/user");
const UserLocation = require("../models/userLocation");
const NodeGeocoder = require('node-geocoder');

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
// exports.findUserForPickUp = async (req, response) => {
//   let api_key = process.env.API_KEY;
//  // let base_url = process.env.BASE_URL;
//   let UserLocation  = req.body.address;

//   const options = {
//     provider: 'google',
  
//     // Optional depending on the providers
//    // fetch: customFetchImplementation,
//     apiKey: api_key, // for Mapquest, OpenCage, Google Premier
//     formatter: null // 'gpx', 'string', ...
//   };
  
//   const geocoder = NodeGeocoder(options);
  
//   // Using callback
//   const userPoint = await geocoder.geocode(UserLocation);
//   return response.json({success:true, responseMessage:userPoint})
//   //let url = base_url + UserLocation + api_key ;
//   //console.log(base_url)
//   //console.log(url)

// //  await request(url, (error, body) => {
// //     if (!error && response.status == 200) {
      
// //       return response.json({
// //         success: true,
// //         responseMessage: body,
// //       });
// //     } else {
// //       return response.status(422).json({
// //         success: false,
// //         responseMessage: `Cannot get a location using this address ${UserLocation}`,
// //         error
// //       });
// //     }
// //   });
// };


exports.findUserLocation = function (req, res) {
  let ACCESS_TOKEN = process.env.API_KEY_MAPBOX
  let { address } = req.body;
  let url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(address) +
    ".json?access_token=" +
    ACCESS_TOKEN +
    "&limit=1";

   request({ url: url, json: true }, (error, response) => {
    if (error) {
      return ( "Unable to connect to" , undefined );
    } else if (response.body.features === undefined) {
      return ("Unable to find location. Try to " + "search another location.");
    } else {
      let longitude = response.body.features[0].center[0];
      let latitude = response.body.features[0].center[1];
      let location = response.body.features[0].place_name;

      return response
        .status(200)
        .json({
          success: true,
          responseMessage: {
            Longitude: longitude,
            Latitude: latitude,
            Longitude: location,
          },
        });
    }
  });
};

