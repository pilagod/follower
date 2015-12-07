/**
 *  Login Apis
 */

/* Const */
var HOST_NAME = "http://localhost:3000/";
// var HOST_NAME = "http://140.112.107.74:3000/";

var express = require('express');
var router = express.Router();
var passport = require('../../passport');

/* Need to Implement */

router.get('/', passport.authenticate('facebook', { scope: 'user_friends', auth_type: 'reauthenticate' }));
router.get('/callback', passport.authenticate('facebook', {
  scope: 'user_friends',
  auth_type: 'reauthenticate',
  successRedirect: HOST_NAME,
  failureRedirect: HOST_NAME.concat('api/login')
}));

module.exports = router;
