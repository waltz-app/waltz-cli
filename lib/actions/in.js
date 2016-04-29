"use strict";
const card = require("../card");

module.exports = function(cb) {
  card.waltzIn().then(() => {
    console.log("Waltzed in. GO!");
    cb();
  }).catch(cb);
}
