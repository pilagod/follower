/**
 *  User Apis
 */

var express = require('express');
var request = require('request');
var router = express.Router();
var passport = require('../../passport');


/**
 *  @api {get} /api/user/getProfile Request user profile
 *  @apiName getProfile
 *  @apiGroup User
 *
 *  @apiSuccess {Boolean} success Status
 *  @apiSuccess {Object} user User profile
 *  @apiSuccess {String} user.id User id
 *  @apiSuccess {String} user.name User name
 *  @apiSuccess {String} user.groupId Id of group user joins
 *
 *  @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      success: true,
 *      user: {
 *        id: '123456789',
 *        name: 'hello',
 *        groupId: 'hafrisd'
 *      }
 *    }
 */
router.get('/getProfile', passport.apiEnsureAuthenticated, function (req, res) {
  var groupId = undefined;

  if (req.socketServer.getUser(req.user.id)) {
    groupId = req.socketServer.getUser(req.user.id).groupId;
  }

  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.displayName,
      groupId: groupId
    }
  });
});

router.get('/getFriends', passport.apiEnsureAuthenticated, function (req, res) {
  request('https://graph.facebook.com/' + req.user.id + '/friends?access_token=' + req.user.accessToken, function (error, response, body) {
    if (error) {
      res.json({
        success: false,
        message: 'Can not get friends from facebook.'
      });
    } else {
      // var friends = JSON.parse(body).data;
      var friends = JSON.parse(body).data.filter(function (friend) {
        console.log(friend);
        return (req.socketServer.getUser(friend.id) && !req.socketServer.getUser(friend.id).groupId);
      });
      res.json({
        success: true,
        friends: friends
      });
    }
  });
});

/* Array of user id */
router.post('/inviteFriends', passport.apiEnsureAuthenticated, function (req, res) {
  var friends = req.body.friends;
  var groupId = req.socketServer.getUser(req.user.id).groupId;
  console.log(friends);

  if (groupId) {
    var group = req.socketServer.getGroup(groupId);
    friends.forEach(function (friendId, index, array) {
      if (!req.socketServer.getUser(friendId).groupId) {
        // var group = req.socketServer.getGroup('test');
        console.log(req.user.displayName);
        req.socketServer.emit(friendId, 'invited', {
          groupId: group.groupId,
          name: group.name,
          description: group.description,
          invitee: req.user.displayName
        });
      }
    });
    res.json({
      success: true
    });
  } else {
    res.json({
      success: false,
      message: 'You have no group.'
    })
  }

});

module.exports = router;
