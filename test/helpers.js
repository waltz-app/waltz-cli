"use strict";
const _ = require("underscore"),
      strftime = require("strftime"),
      card = require("../lib/card");

// generate a random timecard
function timecardFactory(byUsers, maxDays, maxTimes) {
  let days = _.range(0, _.random(0, maxDays || 10)).map(() => {
    let times = _.range(0, _.random(0, maxTimes || 10)).map(() => {
      let start = _.random(0, 23 * 3600 * 1000), // 23 hours
          length = 3600 * 1000; // an hour
      return {
        by: _.sample(byUsers),
        start: strftime(card.TIME_REPR, new Date(start)),
        end: strftime(card.TIME_REPR, new Date(start + length)),
      };
    });
    return {
      date: strftime(card.DAY_REPR, new Date(_.random(1000000000000, new Date().getTime()))),
      times,
    };
  });
  return {
    card: days,
  };
}

function emptyTimecard() {
  return {card: []};
}

// remove the first spaces off each line in a string. This is extremely useful
// in a test for those pesky formatting issues with checking string equality.
// For example:
//     this
//       is
//     hello
// becomes:
// this
//   is
// hello
function unindent(string) {
  let split = string.split('\n');

  // get the first line, and if it's empty, remove it
  let first = split[0];
  while (first.length === 0) {
    split = split.slice(1); // remove the empty lines
    first = split[0];
  }

  // how many spaces start the first line?
  let amt = 0;
  while (first[amt] === " ") { amt++; }

  // strip that amount of spaces off the rest of the lines
  return split.map((i) => i.slice(amt)).join('\n');
}

module.exports = {
  timecardFactory,
  emptyTimecard,
  unindent,
};
