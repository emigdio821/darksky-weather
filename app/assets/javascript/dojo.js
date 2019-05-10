const API_URL =
  "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a34e3e425d9f4cf8828749e34ba822fc/";

require(["dojo/dom", "dojo/dom-construct"], function(dom, domConstruct) {
  var greetingNode = dom.byId("greeting");
  domConstruct.place("<em> there!</em>", greetingNode);
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

require(["dojo/domReady!"], function() {
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

  fetch(skyUrl)
    .then(resolve => {
      if (resolve.ok) {
        console.log(resolve.json());
      } else {
        throw new Error(
          "We are sorry, we were not able to get the forecast data :("
        );
      }
    })
    .then(data => {})
    .catch(error => {});
}

function errorPosition() {
  alert("We cannot get your location, sorry.");
}
