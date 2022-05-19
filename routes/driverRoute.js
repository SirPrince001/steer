const route = require("express").Router();
const driverRoute = require("../controllers/driverController");

route.post("/api/v1/create-driver", driverRoute.createDriver);
route.post("/api/v1/login-driver", driverRoute.loginDriver);
route.get("/api/v1/locate_user", driverRoute.getUserRideRequestLocation);

module.exports = route;
