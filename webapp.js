"use strict";

const debug = require("debug")("strider-kong:webapp");

module.exports = {
  // mongoose schema, if you need project-specific config
  config: {
    kong: {
      url: { type: String },
      service: { type: String },
      route: { type: String },
    },
  },
};
