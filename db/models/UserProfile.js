/**
 *  UserProfile Model
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var UserProfile = mongoose.model('UserProfile', new mongoose.Schema({
  id: String, /* fb id */
  name: String /* fb name */
}));

module.exports = UserProfile;
