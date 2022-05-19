require('dotenv').config();
const { default: axios } = require("axios");

const request = require("request");
var ACCESS_TOKEN =
  "pk.eyJ1Ijoic2lycHJpbmNlIiwiYSI6ImNsM2E2aXdiczAybWwzYmxlZGp5YWt4OWUifQ.cr3blxODt43jPNp34ulJ2w";

  function callback(message, obj) {
    let resp = {
      message,
      data: obj !== undefined ? obj : null
    };

    return console.log(resp);
  }


const forwardGeocoding = function (address) {
  const geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.API_KEY}`;

  axios.get(geoCodeUrl, {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(data => {
    let resp = data.data.results !== undefined && data.data.results.length > 0 ? data.data.results : null;
    callback('location response', resp);
  })
  .catch(e => {
    callback('An error occured while getting location', e);
  });
};


var address = "Ojo aro estate, off eniosa road"; // Sample data

// Function call
forwardGeocoding(address);

// exports.findUserLocation = async (req, res) => {
//   let ACCESS_TOKEN = "";
//   let { address } = request.body;
//   let url =
//     "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
//     encodeURIComponent(address) +
//     ".json?access_token=" +
//     ACCESS_TOKEN +
//     "&limit=1";

//   await request({ url: url, json: true }, (error) => {
//     if (error) {
//       return res.status(404).json({ responseMessage: "Unable to connect to" });
//     } else if (req.body.features.length == 0) {
//       return res
//         .status(422)
//         .json({
//           responseMessage:
//             "Unable to find location. Try to " + "search another location.",
//         });
//     } else {
//       let longitude = res.body.features[0].center[0];
//       let latitude = res.body.features[0].center[1];
//       let location = res.body.features[0].place_name;

//       return res
//         .status(200)
//         .json({
//           success: true,
//           responseMessage: {
//             Longitude: longitude,
//             Latitude: latitude,
//             Longitude: location,
//           },
//         });
//     }
//   });
// };
