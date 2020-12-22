'use strict';

const debug = require('debug')('strider-kong:webapp');

module.exports = {
  // mongoose schema, if you need project-specific config
  config: {
    kong: {
      service: {type: String, default: ''},
      route: {type: String, default: ''}
    }
  }
};
