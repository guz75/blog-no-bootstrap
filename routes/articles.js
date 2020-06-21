//jshint esversion:6

const express = require("express");
const router = express.Router();

router.get("/compose", (req, res) => {
    res.render("compose");
});

module.exports = router;
