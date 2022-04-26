let Mongoose = require("mongoose");

// database function
module.exports = {
  connect: () => {
    Mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const databaseConnection = Mongoose.connection;
    databaseConnection.once("open", () => {
      console.log("Database connected successfully");
    });
    databaseConnection.on("error", (error) => {
      console.log(
        `Unable to connect to database due to this error ${error.message}`
      );
    });
  },
};
