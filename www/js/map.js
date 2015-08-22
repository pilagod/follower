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
        console.log(pos);

        
        var p = {
            lat: 25.126158300000002,
            lng: 121.44270929999998
        };

        addMarker(p);
    })
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
            url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1/v/t1.0-1/p50x50/10565267_752269374837364_6175616971699387755_n.jpg?oh=82567023e76770d09ec29e6464a40a1c&oe=5642061A&__gda__=1447119434_6a8b77b2a0b284b00481ab3150d46df5",
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
