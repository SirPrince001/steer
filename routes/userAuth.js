const route = require("express").Router();
const userRoute = require("../controllers/userController");

route.post("/api/v1/create-user", userRoute.createUser);
route.post("/api/v1/login", userRoute.login);
route.post("/api/v1/pick-user", userRoute.findUserForPickUp);
module.exports = route;
