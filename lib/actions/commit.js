"use strict";
const card = require("../card"),
      git = require("simple-git")();

module.exports = function(cb) {
  card.indexCard().then((path) => {
    git.add([path], (err) => {
      if (err) {
        cb(err);
      } else {
        git.commit(args.message || args.m || "Change work time via Waltz", [path], (err) => {
          if (err) {
            cb(err);
          } else {
            console.log("Successfully logged changes!");
            cb();
          }
        });
      }
    });
  });
}
