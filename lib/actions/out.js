"use strict";
const card = require("../card");

module.exports = function(cb) {
  card.waltzOut().then(() => {
    console.log("Waltzed out. Go work on something else.");
    cb();
  }).catch(cb);
}
