//jshint esversion:6

// Require dependencies / App set up
const { check, validationResult } = require("express-validator");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const configDB = require("./config/database");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Express-session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

// Express-messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Mongoose connection
mongoose.connect(configDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose connection test
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDB connected successfully");
});

// Mongoose models
const Article = require("./models/article");
const User = require("./models/user");

// Passport config
require("./config/passport")(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// User info get
app.use(function(req, res, next){
  res.locals.user = req.user || null;
  
  next();
});

// Render Homepage
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    res.render("home", {articles: articles})
  })
});

// Route files
const articles = require("./routes/articles");
const users = require("./routes/users");
const { find } = require("./models/article");

app.use("/articles", articles);
app.use("/users", users);

// Express app connection
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
