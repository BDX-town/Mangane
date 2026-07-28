/**
 * Jest mock for Framework7 core (ESM-only package).
 * Provides the minimal API surface used by the F7 shell components.
 */
'use strict';

class Framework7 {

  constructor() {}

}

Framework7.use = function() {};

module.exports = Framework7;
module.exports.default = Framework7;
