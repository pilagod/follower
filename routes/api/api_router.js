/**
 *  Api Router
 */

var express = require('express');
var api_login = require('./login/api_login');
var api_user = require('./user/api_user');
var api_group = require('./group/api_group')
var router = express.Router();

router.use('/login', api_login);
router.use('/user', api_user);
router.use('/group', api_group);

module.exports = router;
