/**
 *  View Router
 */

/* Const */
var HTML_ROOT = './public/html';

var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('../passport');

/* Need to Implement */

router.get('/', passport.ensureAuthenticated, function (req, res) {
  // console.log(req.user);
  // console.log(req.socketServer);
  // res.sendFile('index.html', { root: HTML_ROOT });
  request('https://graph.facebook.com/' + req.user.id + '/friends?access_token=' + req.user.accessToken, function (error, response, body) {
    if (JSON.parse(body).error){
      // req.logout();
      console.log(body);
      res.send('Fails');
    }
    else {
      console.log(body);
      res.sendFile('index.html', { root: HTML_ROOT });
    }
  });
});

module.exports = router;
