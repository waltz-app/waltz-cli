"use strict";
const watch = require("../watch");

module.exports = function(cb) {
  watch.watchAndUpdateAccordingly(args);
  cb();
}
