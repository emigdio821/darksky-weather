const API_URL =
  "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a34e3e425d9f4cf8828749e34ba822fc/";

require(["dojo/dom", "dojo/dom-construct"], function(dom, domConstruct) {
  var greetingNode = dom.byId("greeting");
  domConstruct.place("<b> DarkSky Weather</b>", greetingNode);
});

var loader;
require(["dojo/_base/declare", "dojo/dom", "dojo/dom-style"], function(
  declare,
  dom,
  domStyle
) {
  var Loader = declare(null, {
    overlayNode: null,
    constructor: function() {
      this.overlayNode = dom.byId("main-loader");
    },
    onHideLoader: function() {
      domStyle.set(this.overlayNode, "display", "none");
    },
    onShowLoader: function() {
      domStyle.set(this.overlayNode, "display", "initial");
    }
  });
  loader = new Loader();
});

require(["dojo/domReady!", "dojo/request"], function() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser :(");
  } else {
    navigator.geolocation.getCurrentPosition(successPosition, errorPosition);
  }
  loader.onHideLoader();
});


function successPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const skyUrl = `${API_URL}${latitude},${longitude}`;

  require(["dojo/request"], function(request) {
    request(skyUrl).then(
      function(data) {
        console.log(JSON.parse(data));
      },
      function(error) {
        console.log("An error occurred: " + error);
      }
    );
  });
}

function errorPosition() {
  alert("We cannot get your location, sorry.");
}
