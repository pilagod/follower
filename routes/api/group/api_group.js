/**
 *  Group Apis
 */

var express = require('express');
var router = express.Router();
var passport = require('../../passport');

// { group: { name, description } }
router.post('/createGroup', passport.apiEnsureAuthenticated, function (req, res) {
  var groupId, data;

  if (!req.socketServer.getUser(req.user.id).groupId) {
    groupId = req.socketServer.createGroup(req.body.group);
    req.socketServer.joinGroup(req.user.id, groupId);
    res.json({
      success: true,
      message: 'Create group successfully.'
    });
  } else {
    res.json({
      success: false,
      message: 'User already has been in a group.'
    });
  }
});

/* Post groupId */
router.post('/joinGroup', passport.apiEnsureAuthenticated, function (req, res) {
  if (!req.socketServer.getUser(req.user.id).groupId) {
    req.socketServer.joinGroup(req.user.id, req.body.groupId);
    res.json({
      success: true,
      message: 'Join group successfully.'
    })
  } else {
    res.json({
      success: false,
      message: 'User has been in a group.'
    })
  }
});

router.get('/leaveGroup', passport.apiEnsureAuthenticated, function (req, res) {
  if (req.socketServer.getUser(req.user.id).groupId) {
    req.socketServer.emit(req.socketServer.getUser(req.user.id).groupId, 'groupMemberLeave', req.user.id);
    req.socketServer.leaveGroup(req.user.id);
    res.json({
      success: true,
      message: 'Leave group successfully.'
    });
  } else {
    res.json({
      success: false,
      message: 'User hasn\'t been in any group.'
    });
  }
});

router.get('/createGroupTest', passport.apiEnsureAuthenticated, function (req, res) {
  req.socketServer.createGroupTest();
  req.socketServer.joinGroupTest(req.user.id);
  res.json({
    success: true,
    interval: req.socketServer.getClientUpdateInterval()
  });
});

module.exports = router;
