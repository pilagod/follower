(function () {
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1470856563215660',
      xfbml      : true,
      version    : 'v2.4'
    });
    FB.getLoginStatus(function (response) {
      if (response && response.status === "connected") {
        var url = window.location.pathname.slice(1).split('.')[0];
        if (!window.localStorage["userid"]) {
          FB.api('/me', function (response) {
            window.localStorage["username"] = response.name;
            window.localStorage["userid"] = response.id;
            window.localStorage["picture"] = "https://graph.facebook.com/" + response.id + "/picture";
            if (url === "login") {
              window.location.href = "/map.html";
            }
          });
        } else {
          if (url === "login"){
            window.location.href = "/map.html";
          }
        }
      }
    });
    $(window).triggerHandler('fbAsyncInit');
  };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}());

function fbGetLoginStatus(callback) {
  FB.getLoginStatus(callback);
}

function fbLogin() {
  FB.login(function (response) {
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        window.localStorage["username"] = response.name;
        window.localStorage["userid"] = response.id;
        window.localStorage["picture"] = "https://graph.facebook.com/" + response.id + "/picture";
        window.location.href="/map.html";
      });
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      window.location.href="/login.html";
    }
  }, {scope: "public_profile,email"});
}

function fbLogout() {
  FB.getLoginStatus(function(response){
    if (response && response.status === "connected") {
      FB.logout(function (response) {
        console.log("Logout: ", response);
        window.location.href="/login.html";
      });
    }
  });
}

function fbGetProfileIcon(userId, callback) {
  FB.api(
    "/" + userId + "/picture",
    callback
  );
}
