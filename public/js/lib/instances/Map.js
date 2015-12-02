/**
 *  Map Instance
 */

var Promise = require('bluebird');

var _map;
var _markers = {}; /* { id: { id: {string}, position: { lat: {number}, lng: {number} } }, ... } */

var Map = {

  init: function (element, position) {
    _map = new google.maps.Map(element, {
      center: position,
      zoom: 16
    });

    var myoverlay = new google.maps.OverlayView();
    myoverlay.draw = function () {
      //this assigns an id to the markerlayer Pane, so it can be referenced by CSS
      this.getPanes().markerLayer.id='markerLayer';
    };
    myoverlay.setMap(_map);
  },

  getMap: function () {
    return _map;
  },

  getMarkers: function () {
    return _markers;
  },

  getCurrentPosition: function () {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(function(position) {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    })
  },

  addMarker: function (id, position) {
    /* New Marker */
    _markers[id] = new google.maps.Marker({
      position: position,
      map: _map,
      icon: "http://graph.facebook.com/" + id + "/picture?type=large&width=30&height=30",
      optimized: false
    });
  },

  updateMarker: function (id, position) {
    /* Marker setPosition */
    _markers[id].setPosition(position);
  },

  removeMarker: function (id) {
    _markers[id].setMap(null);
    delete _markers[id];
  },

  clearAllMarkers: function (userId) {
    for (var id in _markers) {
      if (id !== userId) {
        this.removeMarker(id);
      }
    }
  }
}

module.exports = Map;
