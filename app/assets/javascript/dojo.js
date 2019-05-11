const API_URL =
  "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a34e3e425d9f4cf8828749e34ba822fc/";

var skycons = new Skycons();

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
      domStyle.set(this.overlayNode, "display", "flex");
    }
  });
  loader = new Loader();
});

require(["dojo/domReady!"], function() {
  loadWeahterData();
});

function loadWeahterData(reloaded) {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser :(");
  } else {
    loader.onShowLoader();
    if (reloaded) onDestroyWidget();
    navigator.geolocation.getCurrentPosition(successPosition, errorPosition);
  }
}

function onDestroyWidget() {
  require(["dojo/dom-construct"], function(domConstruct) {
    domConstruct.destroy("weather-card");
  });
}

function successPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const skyUrl = `${API_URL}${latitude},${longitude}`;

  require(["dojo/request"], function(request) {
    request(skyUrl).then(function(data) {
      var d = JSON.parse(data);
      require(["dojo/html", "dojo/dom", "dojo/domReady!"], function(html, dom) {
        html.set(
          dom.byId("card-content"),
          '<h5 class="mb-4">Here\'s your current location weather <i class="far fa-smile-beam"></i></h5>' +
            '<div id="weather-card" class="card mx-auto mb-" style="max-width: 20rem;">' +
            '<div class="card-body">' +
            '<canvas id="weather-icon" width="64" height="64"></canvas>' +
            `<h5 class="card-title">${d.currently.temperature} ºF</h5>` +
            '<h6 class="card-subtitle mb-1 text-muted">Summary</h6>' +
            `<p class="card-text font-weight-bold">${unixToDate(
              d.currently.time
            )} hrs - ${d.currently.summary}</p>` +
            `<p class="card-text m-0"><span class="font-weight-bold">Humidity: </span>${
              d.currently.humidity
            }%</p>` +
            `<p class="card-text"><span class="font-weight-bold">Wind: </span>${
              d.currently.windSpeed
            } MPH</p>` +
            '<a href="#" class="btn btn-info mr-2" data-toggle="modal" data-target="#forecastModal">Forecast <i class="fas fa-wind"></i></a>' +
            '<a href="#" class="btn btn-info" onClick="loadWeahterData(true)">Reload <i class="fas fa-sync-alt"></i></i></a>' +
            "</div>" +
            "</div>" +
            '<div class="modal fade" id="forecastModal" tabindex="-1" role="dialog" aria-labelledby="forecastModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h5 class="modal-title" id="forecastModalLabel">Forecast <i class="fas fa-wind"></i></h5>' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            "</button>" +
            "</div>" +
            '<div class="modal-body">' +
            '<canvas id="hourly-modal-weather-icon" width="64" height="64"></canvas>' +
            `<h5 class="card-title">~ ${d.hourly.data[0].temperature} ºF</h5>` +
            '<h6 class="card-subtitle mb-1 text-muted">Summary for the next hours</h6>' +
            `<p>${d.hourly.summary}</p>` +
            "<hr>" +
            '<canvas id="daily-modal-weather-icon" width="64" height="64"></canvas>' +
            `<h5 class="card-title mb-1">Min temp: ${
              d.daily.data[0].temperatureMin
            } ºF</h5>` +
            `<h5 class="card-title">Max temp: ${
              d.daily.data[0].temperatureMax
            } ºF</h5>` +
            '<h6 class="card-subtitle mb-1 text-muted">Summary for the next days</h6>' +
            `<p>${d.daily.summary}</p>` +
            "</div>" +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-info" data-dismiss="modal">Cool! <i class="fas fa-heart"></i></button>' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
          {
            parseContent: true
          }
        );
        skycons.add("weather-icon", d.currently.icon);
        skycons.add("hourly-modal-weather-icon", d.hourly.icon);
        skycons.add("daily-modal-weather-icon", d.daily.icon);
        skycons.play();
        loader.onHideLoader();
      });
    });
  }, function(error) {
    require(["dojo/html", "dojo/dom"], function(html, dom) {
      html.set(
        dom.byId("card-content"),
        '<div class="alert alert-danger" role="alert">' +
          `An error ocurred: ${error}` +
          '<a href="#" onClick="document.location.reload(true)" class="alert-link">refreshing</a> the page.' +
          "</div>",
        {
          parseContent: true
        }
      );
      loader.onHideLoader();
    });
  });
}

function errorPosition() {
  require(["dojo/html", "dojo/dom"], function(html, dom) {
    html.set(
      dom.byId("card-content"),
      '<div class="alert alert-danger" role="alert">' +
        "We could not retrieve your location, please check your location settings or try " +
        '<a href="#" onClick="document.location.reload(true)" class="alert-link">refreshing</a> the page.' +
        "</div > ",
      {
        parseContent: true
      }
    );
    loader.onHideLoader();
  });
}

function unixToDate(time) {
  var dt = new Date(time * 1000);
  var hr = dt.getHours();
  var minutes = "0" + dt.getMinutes();
  return hr + ":" + minutes.substr(-2);
}
