"use strict";
const card = require("../card");

module.exports = function(cb) {
  card.cardInit(args).then(() => {
    console.log(`Created ${chalk.cyan('`.timecard.json`')}. Start working with ${chalk.cyan('`waltz in`')}!`);
    cb();
  }).catch(cb);
}
