"use strict";
const card = require("../card"),
      git = require("simple-git")();

module.exports = function(cb) {
  git.getRemotes(true, (err, all) => {
    if (err) {
      cb(err);
    } else {
      let origin = all.find((i) => i.name === "origin");
      if (origin) {
        // try to match against a http or ssh url
        let data = origin.refs.push.match(/.+@.+\..+:(.+)\/(.+)\.git/) ||
                   origin.refs.push.match(/https?:\/\/.+\..+\/(.+)\/(.+)\.git/)
        if (data) {
          // form the url
          let url = `http://waltzapp.co/${data[1]}/${data[2]}`;
          console.log(url);
          if (!args.print) { open(url); }
        } else {
          cb(`Cannot do a regex match against ${origin.refs.push}`);
        }
      } else {
        cb("Cannot find a remote named origin to get a username and repositiory name from.");
      }
    }
  });
}
