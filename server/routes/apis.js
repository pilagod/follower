var express = require('express'),
    router = express.Router(),
    group = {},
    location = {};

/*****************************/
/*          Login            */
/*****************************/

/**
 *  Generate a new group
 *  @param {json} {
 *    memberId: String
 *    latitude: Int
 *    longitude: Int
 *  }
 *  @return {json} {
 *    status: String (true, false)
 *  }
 */
router.post('/login', function (req, res, next) {
  var memberId = req.body.memberId,
      latitude = req.body.latitude || undefined,
      longitude = req.body.longitude || undefined;

  if (!location[memberId]) {
    location[memberId] = {
      "latitude": latitude,
      "longitude": longitude
    }
  }

  console.log(location);
  res.json({
    "status": "true"
  })
});

/*****************************/
/*          Group            */
/*****************************/

/**
 *  Generate a new group
 *  @param {json} {
 *    memberId: String
 *    memberName: String
 *  }
 *  @return {json} {
 *    groupId: String
 *  }
 */
router.post('/group/new', function (req, res, next) {
  var groupId = Math.random().toString(36),
      memberId = req.body.memberId,
      memberName = req.body.memberName;
  while (group.hasOwnProperty(groupId)) {
    groupId = Math.random().toString(36);
  }
  group[groupId] = {};
  group[groupId][memberId] = memberName;
  console.log(group[groupId]);
  res.json({
    "groupId": groupId
  });
});

/**
 *  Add new members to group
 *  @param {json} {
 *    groupId: String
 *    memberId: String
 *    memberName: String
 *  }
 *  @return {json} {
 *    status: String (true, false)
 *  }
 */
router.post('/group/add', function (req, res, next) {
  var groupId = req.body.groupId,
      memberId = req.body.memberId,
      memberName = req.body.memberName;

  if (group[groupId][memberId]) {
    res.json({
      "status": "false"
    });
    return;
  }

  group[groupId][memberId] = memberName;
  console.log(group[groupId]);
  res.json({
    "status": "true"
  });
});

/**
 *  Delete member from group
 *  @param {json} {
 *    groupId: String
 *    memberId: String
 *  }
 *  @return {json} {
 *    status: String (true, false)
 *  }
 */
router.delete('/group/delete', function (req, res, next) {
  var groupId = req.body.groupId,
      memberId = req.body.memberId;

  if (!group[groupId][memberId]) {
    res.json({
      "status": "false",
    });
    console.log(group[groupId]);
    return;
  }

  delete group[groupId][memberId];
  console.log(group[groupId]);
  res.json({
    "status": "true"
  });
});

/*****************************/
/*         Location          */
/*****************************/

/**
 *  Update self's location
 *  @param {json} {
 *    memberId: String
 *    latitude: Int
 *    longitude: Int
 *  }
 *  @return {json} {
 *    status: String (true, false)
 *  }
 */
router.put('/location/update', function (req, res, next) {
  var memberId = req.body.memberId,
      latitude = req.body.latitude,
      longitude = req.body.longitude;

  if (!location[memberId]) {
    res.json({
      "status": "false"
    });
    return;
  }

  location[memberId].latitude = latitude;
  location[memberId].longitude = longitude;

  res.json({
    "status": "true"
  });
});

/**
 *  Get all group members' location
 *  @param {json} {
 *    groupId: String
 *    memberId: String
 *  }
 *  @return {json} {
 *    status: String (true, false)
 *  }
 */
router.post('/location/group', function (req, res, next) {
  console.log(req.body);
  var groupId = req.body.groupId,
      memberId = req.body.memberId,
      result = {
        'self': {},
        'others': []
      };

  console.log(group[groupId]);

  for (var memberIndex in group[groupId]) {
    console.log(memberIndex);
    if (memberIndex === memberId) {
      result['self'] = {
        "memberId": memberId,
        "latitude": location[memberId].latitude,
        "longitude": location[memberId].longitude
      }
    } else {
      result['others'].push({
        "memberId": memberIndex,
        "latitude": location[memberIndex].latitude,
        "longitude": location[memberIndex].longitude
      })
    }
  }

  console.log(result);
  res.json(result);
});

module.exports = router ;
