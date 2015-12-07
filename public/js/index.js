(function () {
  'use strict'
  // var SocketClient = require('./lib/SocketClient.js');
  var socket = require('socket.io-client')();
  var request = require('request');
  var config = require('./lib/config');
  var Map = require('./lib/instances/Map');

  var updatePositionInterval;

  var user = {};

  // image: "http://graph.facebook.com/" + profile.id + "/picture";

  /* Initialize server info */
  window.onload = function () {
    /* New SocketClient */
    request({
      url: config.HOST_API + '/user/getProfile',
      method: 'GET',
      json: true
    }, function (error, response, data) {
      socket.once('init/callback', function (response) {
        console.log('in init/callback');

        if (!response.success) {
          console.log('user already exists!');
        }

        user = response.user;

        if (user.groupId) {
          $('#create').addClass('hidden');
          $('#friend').removeClass('hidden');
          $('#leave').removeClass('hidden');
        }

        Map.getCurrentPosition().then(function (position) {
          Map.init(document.getElementById('map'), position);
          Map.addMarker(user.id, position);
        });
      });

      socket.emit('init', data.user);
      // console.log(JSON.stringify({name: "hello", description: "test"}));
    });
  };

  socket.on('updateMap', function (data) {
    var markers = Map.getMarkers();
    for (var id in data) (function (user) {
      console.log(user.position);
      if (Object.keys(user.position).length > 0) {
        if (!markers[id]) {
          Map.addMarker(id, user.position);
        } else {
          Map.updateMarker(id, user.position);
        }
      }
    }(data[id]));
  });

  socket.on('invited', function (group) {
    if(confirm(
        'An invitation from "' + group.invitee + '"\n' +
        'Join group "' + group.name + '(' + group.description + ')"？')) {
      console.log("Yes");
      request({
        url: config.HOST_API + '/group/joinGroup',
        method: 'POST',
        json: true,
        body: { groupId: group.groupId }
      }, function (error, response, data) {
        if (data.success) {
          if (!updatePositionInterval) {
            updatePositionInterval = setInterval(function () {
              Map.getCurrentPosition().then(function (position) {
                console.log('updatePosition');
                socket.emit('updatePosition', { id: user.id, position: position });
              });
            }, 5000);
          }
          $('#create').addClass('hidden');
          $('#friend').removeClass('hidden');
          $('#leave').removeClass('hidden');
          $('#createBlock').empty();
        }
      });
    } else {
      console.log("No");
    }
  });

  socket.on('groupMemberLeave', function (id) {
    if (id !== user.id) {
      Map.removeMarker(id);
    } else {
      $('#create').addClass('hidden');
      $('#friend').removeClass('hidden');
      $('#leave').removeClass('hidden');
    }
  });

  document.getElementById('create').onclick = function (e) {
    e.preventDefault();
    console.log('create onclick');

    var elements = $();
    elements = elements.add(
      '<div>' +
        '<span>群組名稱：</span>' +
        '<input id="txtGroupName" type="text"/>' +
      '</div>' +
      '<div>' +
        '<span>群組簡述：</span>' +
        '<input id="txtGroupDescription" type="text"/>' +
      '</div>' +
      '<div>' +
        '<button id="btnCreateGroup">建立</button>' +
        '<button id="btnGroupCancel">取消</button>' +
      '</div>'
    );

    $('#createBlock').append(elements);

    document.getElementById('btnCreateGroup').onclick = function (e) {
      e.preventDefault();
      var groupName = $('#txtGroupName').val().trim();
      var groupDescription = $('#txtGroupDescription').val().trim();

      console.log("groupName: ", groupName);
      console.log("groupDescription: ", groupDescription);

      if (groupName !== '' && groupDescription !== '') {
        request({
          url: config.HOST_API + '/group/createGroup',
          method: 'POST',
          json: true,
          body: { group: { name: groupName, description: groupDescription } }
        }, function (error, response, data) {
          if (data.success) {
            $('#create').addClass('hidden');
            $('#friend').removeClass('hidden');
            $('#leave').removeClass('hidden');
            $('#createBlock').empty();

            if (!updatePositionInterval) {
              updatePositionInterval = setInterval(function () {
                Map.getCurrentPosition().then(function (position) {
                  console.log('updatePosition');
                  socket.emit('updatePosition', { id: user.id, position: position });
                });
              }, 5000);
            }
          }
        });
      }
    };

    document.getElementById('btnGroupCancel').onclick = function (e) {
      e.preventDefault();
      $('#createBlock').empty();
    };

    // request(config.HOST_API + '/group/createGroupTest', function (error, response, body) {
    //   var data = JSON.parse(body);
    //   if (data.success) {
    //     updatePositionInterval = setInterval(function () {
    //       Map.getCurrentPosition().then(function (position) {
    //         console.log('updatePosition');
    //         socket.emit('updatePosition', { id: user.id, position: position });
    //       });
    //     }, data.interval);
    //   }
    // });
  };

  // document.getElementById('join').onclick = function (e) {
  //   e.preventDefault();
  //   console.log('join onclick');
  // 
  //   request({
  //     url: config.HOST_API + '/group/joinGroup',
  //     method: 'POST',
  //     json: true,
  //     body: { groupId: 'test' }
  //   }, function (error, response, data) {
  //     if (data.success) {
  //       $('#friend').removeClass('hidden');
  //       $('#leave').removeClass('hidden');
  //
  //       if (!updatePositionInterval) {
  //         updatePositionInterval = setInterval(function () {
  //           Map.getCurrentPosition().then(function (position) {
  //             console.log('updatePosition');
  //             socket.emit('updatePosition', { id: user.id, position: position });
  //           });
  //         }, 5000);
  //       }
  //     }
  //   });
  // };

  document.getElementById('leave').onclick = function (e) {
    e.preventDefault();
    console.log('leave onclick');
    request({
      url: config.HOST_API + '/group/leaveGroup',
      method: 'GET',
      json: true
    }, function (error, response, data) {
      if (data.success) {
        $('#create').removeClass('hidden');
        $('#friend').addClass('hidden');
        $('#friendsBlock').empty();
        $('#leave').addClass('hidden');
        Map.clearAllMarkers(user.id);
        clearInterval(updatePositionInterval);
      }
    });
  };

  document.getElementById('friend').onclick = function (e) {
    e.preventDefault();
    console.log('friend onclick');
    request(config.HOST_API + '/user/getFriends', function (error, response, body) {
      var friends = JSON.parse(body).friends;
      var elements = $();
      console.log(friends);
      for (var index = 0; index < friends.length; index++) {
        elements = elements.add(
          '<div class="friend">' +
            '<div><input type="checkbox"/></div>' +
            '<div class="image"><img src="http://graph.facebook.com/' + friends[index].id + '/picture?type=large&width=50"/></div>' +
            '<div class="name">' + friends[index].name + '</div>' +
          '</div>'
        );
      }
      $('#friendsBlock').append(elements);
      $('#friendsBlock').append(
        '<div>' +
          '<button id="btnInvite">邀請</button>' +
          '<button id="btnInviteCancel">取消</button>' +
        '</div>'
      );

      document.getElementById('btnInvite').onclick = function (e) {
        e.preventDefault();
        console.log('btnInvite onclick');

        // var invitedFriends = ['867269946655421'];
        var invitedFriends = [];
        var inviteCheckboxes = $('.friend input[type="checkbox"]');

        inviteCheckboxes.toArray().forEach(function (inviteCheckbox, index) {
          if ($(inviteCheckbox).prop('checked')) {
            invitedFriends.push(friends[index].id);
          }
        });

        // inviteFriends = ['867269946655421'];
        console.log(invitedFriends);

        request({
          url: config.HOST_API + '/user/inviteFriends',
          method: 'POST',
          json: true,
          body: { friends: invitedFriends }
        }, function (error, response, body) {
          console.log(body);
          if (body.success) {
            $('#friendsBlock').empty();
          }
        });

        // console.log($('.friend input[type="checkbox"]'));
        // console.log($($('.friend input[type="checkbox"]')[0]).prop('checked'));
      };

      document.getElementById('btnInviteCancel').onclick = function (e) {
        e.preventDefault();
        $('#friendsBlock').empty();
      };
    });
  };

  /* Should tell server clear user data */
  window.onbeforeunload = function () {
  }
}());
