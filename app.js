//jshint esversion:6

// Require dependencies / App set up
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const configDB = require("./config/database");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Mongoose connection
mongoose.connect(configDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose connection test
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDB connected successfully");
});



// Express app connection
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
