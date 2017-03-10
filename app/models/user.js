var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.User;

User.comparePassword = function(storedPassword, attemptedPassword, callback) {
  callback (storedPassword === attemptedPassword);
};

module.exports = User;
