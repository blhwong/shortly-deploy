var db = require('../config');
var crypto = require('crypto');

var Link = db.Link;

Link.initialize = function(link) {
  var shasum = crypto.createHash('sha1');
  shasum.update(link);
  return shasum.digest('hex').slice(0, 5);
};

module.exports = Link;
