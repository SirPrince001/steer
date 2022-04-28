const route = require("express").Router();
const driverRoute = require("../controllers/driverController");

route.post("/api/v1/create-driver", driverRoute.createDriver);
route.post("/api/v1/login-driver", driverRoute.loginDriver);

module.exports = route;
