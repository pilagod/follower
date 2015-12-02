var mongoose = require('mongoose');
// var Promise = require('bluebird');
var models = require('./models');
var db = undefined;
// var resolveConnectedPromise;
// var connectedPromise = new Promise(function (resolve, reject) {
//   resolveConnectedPromise = resolve;
// });

mongoose.connect('mongodb://localhost/followup');
db = mongoose.connection;

db.on('error', function (error) {
  console.error('connection error: ' + error);
});

db.once('open', function (argument) {
  /* this point to db */
  // for (var key in models) (function (model) {
  //   this.db.listCollections({name: (model.modelName.toLowerCase()) + 's'}).toArray(function (err, collectionInfo) {
  //     // console.log(collectionInfo);
  //     if (collectionInfo.length < 1) {
  //       (new model()).save(function (err, model) {
  //         if (err) console.log(err);
  //       });
  //     }
  //   });
  // }.call(this, models[key]));

  console.info("MongoDB Connected.");
  // resolveConnectedPromise({
  //   UserInfo: models.UserInfo,
  //   UserProfile: models.UserProfile,
  //   GroupInfo: models.GroupInfo
  // });
});

module.exports = db;
