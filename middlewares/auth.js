const express = require('express');
const user = require('../models/user');

module.exports = function (req, res, next) {
  if (!req.user) {
    return res.status(401).send("You must be logged in to create a blog");
  }
  next();
};
