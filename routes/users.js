//jshint esversion:6

//require dependencies
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { check, validationResult } = require("express-validator");
const passport = require("passport");

//User model
const User = require("../models/user");
// const { check } = require("express-validator");

// Render register page
router.get("/register", (req, res) => {
  const errors = [];
  res.render("register", {errors: errors});
});

// Register process
router.post("/register", [
  check("name", "The name field is required").notEmpty(),
  check("email")
  .notEmpty().withMessage("The email field is required")
  .isEmail().withMessage("The email format is incorrect"),
  check("username", "The username field is required").notEmpty(),
  check("password")
  .notEmpty().withMessage("The passsword field is required")
  .custom((value, {req}) => {
    if (value !== req.body.password2) {
      throw new Error("Passwords don't match");
    } else {
      return value;
    }
  })
], (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const website = req.body.website;

  let errors = validationResult(req).array();
  
  if(errors.length > 0) {
    res.render("register", {errors: errors});
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      website: website
    });
    
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
          if(err) {
            console.log(err);
          }
          newUser.password = hash;
          newUser.save(err => {
            if (err) {
              console.log(err);
            } else {
              req.flash("success", "You have successfully registered and can login");
              res.redirect("/users/login");
            }
          });
      });
    });
  }
});

// Render login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login process
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/login",
  failureFlash: true
}));

// Logout process
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have successfully logged out");
  res.redirect("/users/login");
})

module.exports = router;
