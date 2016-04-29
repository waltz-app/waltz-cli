"use strict";
const card = require("../card"),
      chalk = require("chalk");

module.exports = function(cb) {
  let total = [];
  return card.getCard().then((data) => {
    total.push(chalk.bold(chalk.green("Unpaid Hours") + " / " + chalk.red("Paid Hours") + ":"));
    let total_duration = card.totalDuration(data, (day, time) => {
      if (day.disabled) {
        total.push(`p ${chalk.red(day.date)}\t\t ${time.start} - ${time.end || "(no end)"}`)
      } else {
        total.push(`u ${chalk.green(day.date)}\t\t ${time.start} - ${time.end || "(no end)"}`)
      }
    });

    // the total time that it took, prettyprinted
    total.push(`About ${Math.floor(total_duration / 3600)} hours, ` +
      `${Math.floor(total_duration / 60) % 60} minutes, ` + 
      `and ${total_duration % 60} seconds`
    )
    // if there is an hourly rate present, log out the total cost of the
    // project
    if (data.hourlyRate) {
      total.push(` = $${Math.round( 100 * (total_duration / 3600) * data.hourlyRate) / 100}`)
    }
    return total.join('\n');
  }).catch(cb);
}
