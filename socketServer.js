var socketIO = require('socket.io');
var assign = require('object-assign');

var SERVER_UPDATE_INTERVAL = 5000;
var CLIENT_UPDATE_INTERVAL = 5000;

var updateMapInterval;
var _sockets = {};
var _users = {}; /* { userid: { groupId } }, ... } */
var _groups = {}; /* { groupId: { groupId, name, description, members: { userId: { position: {lat, lng} }, ... }, inactiveCount }, ... }*/

// _groups['test'] = {
//   groupId: 'test',
//   name: 'test',
//   description: 'test',
//   members: {}
// };

/*************************/
/*    Private Methods    */
/*************************/

function _setUpdateMapInterval(emit) {
  updateMapInterval = setInterval(function () {
    if (Object.keys(_groups).length > 0){
      for (var groupId in _groups) (function (group) {
        emit(group.groupId, 'updateMap', group.members);
      }(_groups[groupId]));
    }
    // console.log('updateMapInterval');
    console.log("Groups: ", _groups);
    console.log("Users: ", _users);
    // console.log("Sockets: ", _sockets);
  }, SERVER_UPDATE_INTERVAL);
}

function _clearUpdateMapInterval() {
  clearInterval(updateMapInterval);
}

function _addSocket(socketId, userId) {
  _sockets[socketId] = userId;
}

function _removeSocket(socketId) {
  var userId = _sockets[socketId];
  delete _sockets[socketId];
  return userId;
}

/*************************/
/*     Socket Server     */
/*************************/

var SocketServer = function (server) {

  var _io = socketIO(server);
  console.log("Socket Server Start");

  /* Should set Interval to send group info */
  this.start = function () {
    _io.on('connection', function (socket) {
      /* Should Define Some General Event */
      console.log('A User Connected');
      console.log('Socket Id: ', socket.id);
      // console.log('Socket: ', _io.sockets.connected[socket.id]);

      socket.once('init', function (user) {
        /* user: { id: {string}, name: {string}, groupId: {string} } */
        /* Group sockets from same user to specific room, identified by user id */
        socket.join(user.id);
        _addSocket(socket.id, user.id);

        if (!_users[user.id]) {
          /* If user not exists, create a new user. */
          this.createUser(user.id, assign({}, user, { sockets: {} }));
          this.addUserSocket(user.id, socket);
          socket.emit('init/callback', {
            success: true,
            user: user
          });
        } else {
          /* If user exists, use existing user. */
          this.addUserSocket(user.id, socket);

          if (_users[user.id].groupId) {
            socket.join(_users[user.id].groupId);
          }

          socket.emit('init/callback', {
            success: false,
            user: {
              id: _users[user.id].id,
              name: _users[user.id].name,
              groupId: _users[user.id].groupId
            }
          });
        }
      }.bind(this));

      socket.on('updatePosition', function (user) {
        if (_users[user.id] && _users[user.id].groupId) {
          console.log('on update');
          this.updateGroupMemberPos(user.id, user.position);
        }
      }.bind(this));

      socket.on('disconnect', function () {
        console.log('A User Disconnected');
        console.log(_users[_sockets[socket.id]]);
        if (_users[_sockets[socket.id]]) {
          console.log("remove user");
          this.removeUserSocket(_removeSocket(socket.id), socket.id);
        }
      }.bind(this));

    }.bind(this));
  };


  /*************************/
  /*     Public Actions    */
  /*************************/

  /**
   *  Emit message to specific room
   *  @param {string} id: user id / group id
   *  @param {string} event: event type
   *  @param {object} message: data sended to client
   */
  this.emit = function (id, event, message) {
    _io.to(id).emit(event, message);
  };

  /**
   *  Get client update interval setting
   */
  this.getClientUpdateInterval = function () {
    return CLIENT_UPDATE_INTERVAL;
  };


  /*************************/
  /*  User Public Actions  */
  /*************************/

  /**
   *  Get user by id
   *  @param {string} id: user id
   */
  this.getUser = function (id) {
    return _users[id];
  };

  /**
   *  New user connect to socket server
   *  @param {object} user: { id: {string}, name: {string}, socket: {object}, socketClient: {object} }
   */
  this.createUser = function (id, user) {
    _users[id] = user;
  };

  /**
   *  Add socket to user
   *  @param {string} id: user id
   *  @param {object} socket: socket object
   */
  this.addUserSocket = function (id, socket) {
    _users[id].sockets[socket.id] = socket;
  };

  /**
   *  Remove socket from user
   *  @param {string} id: user id
   *  @param {string} socketId: socket id
   */
  this.removeUserSocket = function (id, socketId) {
    delete _users[id].sockets[socketId];
    if (Object.keys(_users[id].sockets).length === 0) {
      if (_users[id].groupId) {
        this.emit(_users[id].groupId, 'groupMemberLeave', id);
        this.leaveGroup(id);
      }
      delete _users[id];
    }
  };

  /*************************/
  /*  Group Public Actions */
  /*************************/

  /**
   *  Get group by id
   *  @param {string} groupId: group id
   */
  this.getGroup = function (groupId) {
    return _groups[groupId];
  };

  /**
   *  User create a new group
   *  @param {object} group: { name: {string}, description: {string} }
   */
  this.createGroup = function (group) {
    var groupId = (new Date().getTime() + Math.floor(Math.random() * 999999)).toString(36);
    _groups[groupId] = {
      groupId: groupId,
      name: group.name,
      description: group.description,
      members: {}
    };
    return groupId;
  };

  /**
   *  Delete a empty group
   *  @param {string} groupId: group id
   */
  this.deleteGroup = function (groupId) {
    delete _groups[groupId];
  };

  /**
   *  User join a group
   *  @param {string} id: user id
   *  @param {string} groupId: group id
   */
  this.joinGroup = function (id, groupId) {
    _users[id].groupId = groupId;

    /* All user connected sockets join group */
    for (var socketId in _users[id].sockets) (function (socket) {
      socket.join(groupId);
    }(_users[id].sockets[socketId]))

    /* Initialize user position */
    _groups[groupId].members[id] = {
      position: {}
    };
  };

  /**
   *  User leave his group
   *  @param {string} id: user id
   */
  this.leaveGroup = function (id) {
    var groupId = _users[id].groupId;

    /* Delete user from group */
    delete _groups[groupId].members[id];
    if (Object.keys(_groups[groupId].members).length === 0) {
      this.deleteGroup(groupId);
    }

    /* All user connected sockets leave group */
    for (var socketId in _users[id].sockets) (function (socket) {
      socket.leave(groupId);
    }(_users[id].sockets[socketId]))

    /* Clear user groupId */
    _users[id].groupId = undefined;
  };

  /**
   *  Update group member's position
   *  @param {string} id: user id
   *  @param {object} position: { lat: {number}, lng: {number} }
   */
  this.updateGroupMemberPos = function (id, position) {
    _groups[_users[id].groupId].members[id].position = position;
  }

  /* Update Map Info */
  _setUpdateMapInterval.call(this, this.emit);
};

module.exports = SocketServer;
