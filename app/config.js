var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017');
var db = mongoose.connection;



db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('we are connected to MMMMM');
});

var Schema = mongoose.Schema;

var urlSchema = new Schema({
  _id: Number,
  url: String,
  baseUrl: String,
  code: String,
  title: String, 
  visits: Number,
  timestamp: { type: Date, default: Date.now }
});

var usersSchema = new Schema({
  _id: Number,
  username: {type: String, unique: true},
  password: String,
  timestamp: { type: Date, default: Date.now }
});

var User = mongoose.model('User', usersSchema);
// var user1 = new User();
// console.log('===========user1 is', user1);
User.create({_id: 1, username: 'Brandon', password: 'mango'}, function(err, user1) {
  if (err) {
    console.log('error: ', err);
  } else {

    console.log('saved!');
    console.log('user: ', user1);
  }
});
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

module.exports = db;
