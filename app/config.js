var path = require('path');
var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.connect('mongodb://localhost/shortly');
var db = mongoose.connection;

Promise.promisifyAll(mongoose);

db.on('error', console.error.bind(console, 'connection error:'));

db.onceAsync('open')
  .then(function() {
    console.log('We are connected');
  });

var Schema = mongoose.Schema;

var urlSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String, 
  visits: { type: Number, default: 0},
  timestamp: { type: Date, default: Date.now }
});

var usersSchema = new Schema({
  username: {type: String, unique: true},
  password: String,
  timestamp: { type: Date, default: Date.now }
});

var User = mongoose.model('User', usersSchema);
var Link = mongoose.model('Link', urlSchema);

module.exports = {
  db: db,
  Link: Link,
  User: User
};
