var Locator = require('guidance-replay').Locator;
var mapboxgl = require('mapbox-gl');
var point = require('turf-point');

var config = require('./san-francisco-route-osrm.json'); //require('./configuration.json');
var run = require('../index.js').simulate;
var util = require('../lib/util.js');
var version = util.version(config);

// Ensure that access token is set locally
if (!process.env.MapboxAccessToken) {
  throw new Error('An API access token is required to use Mapbox GL. See https://www.mapbox.com/developers/api/#access-tokens');
} else {
  mapboxgl.accessToken = process.env.MapboxAccessToken;
}

var res = run(config, 1000, '10x'); // run the simulation

res.on('update', function(data) {
  var locator = new Locator(config.routes);
  var userStep = locator.step(data.stepTime);
  // add navigation for Mapbox Directions v5 responses
  if (version === 'v5') {
    var navigation = require('navigation.js')({
      units: 'kilometers',
      maxReRouteDistance: 0.03,
      maxSnapToLocation: 0.01
    });

    var userLocation = point(data.stepCoords); // get the current simulation location
    console.log(userLocation);
    var route = config.routes[0].legs[0];
    if (userStep < route.steps.length) {
      var userNextStep = navigation.getCurrentStep(userLocation, route, userStep); // determine the next step
      if (userNextStep.step > userStep) { userStep++; } // if the step has incremented up in the navigation.js response, increment in simulation as well
    }
  }
});
