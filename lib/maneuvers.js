/**
 * This function retrieves the location of all maneuvers specified in the route.
 * The maneuvers in this object should align with the maneuvers specified in the
 * config.maneuvers array.
 * @name getManeuvers
 * @param {Object} config Configuration parameters.
 * See `run` function for more information.
 * @param {string} version Directions API version.
 * @returns {Object} All manuevers along route by coordinate position where.
 *      key {string} Coordinate position.
 *    value {string} Maneuver description.
 */
module.exports = maneuvers;
function maneuvers (config, version) {
  var maneuvers = {};
  var location;
  var type;
  if (version === 'v5') {
    for (var i = 0; i < config.routes[0].legs[0].steps.length; i++) {
      if (config.routes[0].legs[0].steps[i].maneuver) {
        location = config.routes[0].legs[0].steps[i].maneuver.location;
        type = config.routes[0].legs[0].steps[i].maneuver.type;
        var modifier = config.routes[0].legs[0].steps[i].maneuver.modifier;
        maneuvers[location] = [type, modifier];
      }
    }
  } else {
    for (var j = 0; j < config.routes[0].steps.length; j++) {
      location = config.routes[0].steps[j].maneuver.location.coordinates;
      type = config.routes[0].steps[j].maneuver.type;
      maneuvers[location] = [type];
    }
  }
  return maneuvers;
}