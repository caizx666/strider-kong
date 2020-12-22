"use strict";

const debug = console.log;
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
      // Listen for events on the internal job emitter.
      //   Look at strider-runner-core for an
      //   enumeration of the events. Emit plugin.[pluginid].myevent to
      //   communicate things up to the browser or to the webapp.
      listen: function (emitter, context) {
        debug(context);
        emitter.on("job.status.phase.done", function (id, data) {
          const phase = data.phase;
          debug(`the ${phase} phase has completed`);
          return true;
        });
      },
      // For each phase that you want to deal with, provide either a
      // shell command [string] or [Object] (as demo'd below)
      // or a fn(context, done(err, didrun))
      environment: "",
      prepare: "",
      test: "",
      //function style (calling done is a MUST)
      deploy: function (context, done) {
        //this will show up in the terminal log as 'info'
        debug(config);

        kongapi
          .registerapi({
            ...config,
            service: JSON.parse(config.service),
            route: JSON.parse(config.route),
          })
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
