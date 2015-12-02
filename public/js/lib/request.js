(function () {
  var Promise = require('bluebird');

  module.exports = function (method, url, data) {
    return new Promise(function (resolve, reject) {
      var httpRequest;
      if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
          httpRequest.overrideMimeType('text/xml');
        }
      } else if (window.ActiveXObject) { // IE
        try {
          httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
          console.log(e);
          try {
            httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
          }
          catch (e) {
            console.log(e);
          }
        }
      }

      if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        resolve({
          success: false
        });
      }

      httpRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            resolve(JSON.parse(this.responseText));
          } else {
            resolve({
              status: this.status,
              success: false
            });
          }
        }
      };

      httpRequest.open(method, url, true);
      //
      // if (method === 'POST') {
      //   httpRequest.setRequestHeader('Content-Type', 'application/json');
      // }
      //
      httpRequest.send(data);
    });
  };
}());
