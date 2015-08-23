(function () {
  var url = window.location.pathname.slice(1).split('.')[0];
  if (!window.localStorage['userid'] && url !== 'login') {
    window.location.href = "login.html";
  }
}());
