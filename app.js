require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const routes = require('./routes')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));
require("./database/db").connect();
app.use(routes)

app.get((request, response) => {
  response.json(200,{ responseMessage: "Welcome to our Steer app" });
});

module.exports = app;
