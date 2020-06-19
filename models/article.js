//jshint esversion:6

const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Article = module.exports = mongoose.model("Article", articleSchema);
