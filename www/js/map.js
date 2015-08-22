// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = [];

function initMap() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            center: pos,
            shape:{coords:[17,17,18],type:'circle'},
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        addMarker(pos);

        // google.maps.event.addListenerOnce(map, 'idle', function(){
        //     $('img[src^="https://graph.facebook.com"]').css({"border-radius": "80px"});
        //     // console.log($('img[src^="https://graph.facebook.com"]'));
        // });

    })
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
            url: window.localStorage["picture"],
            //the size of the image is 32x32,
            //when you want to add a border you must add 2*borderWidth to the size
            size:new google.maps.Size(50,50)
        },
        //define the shape
        shape:{coords:[17,17,18],type:'circle'},
        //set optimized to false otherwise the marker  will be rendered via canvas
        //and is not accessible via CSS
        optimized:false
    });
    markers.push(marker);
}
