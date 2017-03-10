var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.findAsync()
    .then(function(links) {
      res.status(200).send(links);
    });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    return res.sendStatus(404);
  }

  Link.findOneAsync({url: uri})
    .then(function(err, found) {
      if (found) {
        res.status(200).send(found.attributes);
      } else {
        util.getUrlTitle(uri, function(err, title) {
          if (err) {
            return res.sendStatus(404);
          }
          var newLink = {
            url: uri,
            title: title,
            baseUrl: req.headers.origin,
            code: Link.initialize(uri)
          };  
          Link.createAsync(newLink)
            .then(function(err) {
              res.status(200).send(newLink);
            });      
        });
      }
    });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOneAsync({username: username})
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        User.comparePassword(user.password, password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOneAsync({username: username})
    .then(function(user) {
      if (!user) {
        var newUser = {
          username: username,
          password: password
        };
        User.createAsync(newUser)
          .then(function(err) {
            if (err) {
              console.log('error', err);
            } 
            console.log('User was created');
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  Link.findOneAsync ({code: null}) 
    .then(function(results) {
    });
  Link.findOneAsync({ code: req.params[0] })
    .then(function(link) {
      if (!link) {
        res.redirect('/');
      } else {
        link.set({ visits: link.get('visits') + 1 })
          .save() 
          .then(function() {
            return res.redirect(link.get('url'));
          });
      }
    });
};