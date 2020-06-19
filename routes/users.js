//jshint esversion:6

//require dependencies
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//User model
const User = require("../models/user");

// Render register page
router.get("/register", (req, res) => {
  res.render("register");
});

// Register process
router.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const website = req.body.website;

  const newUser = new User({
    name: name,
    email: email,
    username: username,
    password: password,
    website: website
  });

  newUser.save(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/users/login");
    }
  });
});

// Render login page
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
