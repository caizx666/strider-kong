"use strict";

const kongapi = require("./lib/kong-registerapi");

module.exports = {
  // Initialize the plugin for a job
  //   config: the config for this job, made by extending the DB config
  //           with any flat-file config
  //   job:    see strider-runner-core for a description of that object
  //   context: currently only defines "dataDir"
  //   cb(err, initializedPlugin)
  init: function (config, job, context, cb) {
    return cb(null, {
      // any extra env variables. Will be available during all phases
      env: {},

      // For each phase that you want to deal with, provide either a
      // shell command [string] or [Object] (as demo'd below)
      // or a fn(context, done(err, didrun))
      environment: "",
      prepare: "",
      test: "",
      //function style (calling done is a MUST)
      deploy: function (context, done) {
        //this will show up in the terminal log as 'info'
        //debug(config.url, config.service, config.route);

        const service = JSON.parse(config.service);
        const route = JSON.parse(config.route);

        kongapi
          .registerapi(
            {
              ...config,
              service,
              route,
            },
            context
          )
          .then(() => {
            done(null, true);
          })
          .catch((err) => {
            done(err, true);
          });
      },
      cleanup: "",
    });
  },
  // this is only used if there is _no_ plugin configuration for a
  // project. See gumshoe for documentation on detection rules.
  autodetect: {
    filename: "package.json",
    exists: true,
  },
};
