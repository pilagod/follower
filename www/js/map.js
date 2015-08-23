// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = {};

function initMap() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: pos,
            shape:{coords:[17,17,18],type:'circle'},
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        addMarker(pos);
        console.log(markers);

        google.maps.event.addListener(map,'zoom_changed', function () {
          var zoomLevel = map.getZoom() < 16 ? zoomLevel = 1 : zoomLevel = 2;
          console.log(map.getZoom());
          for (i = 0; i < markers.length; i++) {
            if (zoomLevel === 2) {
              markers[i].setIcon(markers[i].iconLevel2);
            }
            else {
              markers[i].setIcon(markers[i].iconLevel1);
            }
          }
        });

        // google.maps.event.addListenerOnce(map, 'idle', function(){
        //     $('img[src^="https://graph.facebook.com"]').css({"border-radius": "80px"});
        //     // console.log($('img[src^="https://graph.facebook.com"]'));
        // });
        // var pilagod = {lat:25.020058300000002, lng: 121.53760929999996},
        //     yvonne = {lat:25.021258300000002, lng: 121.53500929999996};
        //     count = 0;
        addMarker_demo({lat:25.020058300000002, lng: 121.53760929999996}, "https://graph.facebook.com/867269946655421/picture?width=20");
        addMarker_demo({lat:25.021258300000002, lng: 121.53500929999996}, "https://graph.facebook.com/10153403037175660/picture?width=20&height=20");
        // while(count < 5){
        //     addMarker_demo({lat:pilagod.lat + count * 0.01, lng: pilagod.lng + count * 0.01}, "https://graph.facebook.com/867269946655421/picture?width=20");
        //     addMarker_demo({lat:yvonne.lat + count * 0.01, lng: yvonne.lng + count * 0.01}, "https://graph.facebook.com/867269946655421/picture?width=20");
        // }
        
    })
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
            url: window.localStorage["picture"] + "?width=20"
            //the size of the image is 32x32,
            //when you want to add a border you must add 2*borderWidth to the size
            // size:new google.maps.Size(50,50)
        },
        //define the shape
        // shape:{coords:[17,17,18],type:'circle'},
        //set optimized to false otherwise the marker  will be rendered via canvas
        //and is not accessible via CSS
        optimized: false
    });
    marker.iconLevel1 = window.localStorage["picture"] + "?width=20";
    marker.iconLevel2 = window.localStorage["picture"] + "?width=35";

    // markers.push(marker);
    markers[window.localStorage["userid"]] = marker;
}


// Adds a marker to the map and push to the array.
function addMarker_demo(location,url) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
            url: url
            //the size of the image is 32x32,
            //when you want to add a border you must add 2*borderWidth to the size
            // size:new google.maps.Size(50,50)
        },
        //define the shape
        // shape:{coords:[17,17,18],type:'circle'},
        //set optimized to false otherwise the marker  will be rendered via canvas
        //and is not accessible via CSS
        optimized: false
    });

    marker.iconLevel1 = window.localStorage["picture"] + "?width=20";
    marker.iconLevel2 = window.localStorage["picture"] + "?width=35";

    // markers.push(marker);
    markers[window.localStorage["userid"]] = marker;
}