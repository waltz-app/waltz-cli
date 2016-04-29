"use strict";
const card = require("../card"),
      chalk = require("chalk");

module.exports = function(cb) {
  card.getCard().then((data) => {
    return Object.assign(data, {
      card: data.card.map((time) => {
        if (!time.disabled) {
          time.disabled = `${strftime(card.DAY_REPR)}\n${strftime(card.TIME_REPR)}`
        }
        return time;
      })
    });
  }).then(card.setCard).then(() => {
    console.log(chalk.cyan("All previous times are now disabled."));
  }).then(cb.bind(this, null)).catch(cb);
}
