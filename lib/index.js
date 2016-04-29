#!/usr/bin/env node
"use strict";
const args = require("minimist")(process.argv.slice(2)),
      pkg = require("../package.json"),
      card = require("./card"),
      fs = require("fs-extra"),
      ejs = require("ejs"),
      strftime = require("strftime"),
      open = require("open"),
      _ = require("underscore"),
      watch = require("./watch"),
      chalk = require("chalk");
const action = args._[0] // what are we trying to do?

const requireDir = require("require-dir");
let actions = requireDir("./actions");

// aliases to other command names
actions.invoice = actions.report;
actions.list = actions.ls;
actions.print = actions.ls;
actions.markpaid = actions.paycheck;
actions.push = actions.commit;
actions.online = actions.web;
actions.open = actions.web;

function run(action, args, cb) {
  cb = cb || () => null;
  if (actions[action]) {
    actions[action]().then((data) => {
      console.log(data);
    }).catch((err) => {
      console.error(err.stack);
    });
  } else if (args.help || args.h) {
    showHelp();
  } else if (args.version || args.v) {
    showVersion();
  } else {
    showNoCommand();
  }
}
run(action, args);

function touchDotTimecard() {
  fs.mkdirpSync(`${process.env.HOME}/.timecard/templates`);
}


// given a timecard, calculate the total amount of time spent on the project.
function totalDuration(data, cbForEach) {
  return data.card.reduce((acc, day) => {
    return acc + day.times.reduce((acc, time) => {
      cbForEach && cbForEach(day, time);
      if (!day.disabled) {
        return acc + card.getDurationFor(day, time);
      } else {
        return acc;
      }
    }, 0);
  }, 0) / 1000 || 0;
}

// there was an error, somewhere
// catch it, and log it out.
function onError(error) {
  if (process.env.NODE_ENV !== "test") {
    console.log(chalk.red(`Oh no! There was an error!\n${error.toString()}`));
  } else {
    throw error;
  }
}

function showVersion() {
  console.log(`Waltz CLI version ${chalk.green(pkg.version)}`);
}

function showNoCommand() {
  card.echoLogo();
  showVersion();
  console.log(`No such command. Please run ${chalk.magenta("waltz --help")} for help.`);
}

function showHelp() {
  card.echoLogo();
  showVersion();
  console.log(`
Record your project development time.
 
Set up waltz with \`waltz init\`, then \`waltz in\` or \`waltz out\` to
record start or end time, respectively. Alternatively, use \`waltz watch\` to
manage recording your time automatically. To see a list of all times, run
\`waltz ls\`, and to generate a fancy-looking invoice, use \`waltz report\`.
 
Commands

  ---
  ${chalk.magenta("waltz init")}
  ---
  Create a new timecard in the current directory.
    \`--commit\` will fashion and make a new commit for this timecard.

  ---
  ${chalk.magenta("waltz in")}
  ---
  Clock in, starting a new time. This is typically run at the start of a work period.

  ---
  ${chalk.magenta("waltz out")}
  ---
  Clock out the current time. This is typically run at the end of a work period. If run with no unending times, it will error.

  ---
  ${chalk.magenta("waltz ls")} (aliased to \`waltz print\` and \`waltz list\`)
  ---
  List all times that are currently in the timecard.

  ---
  ${chalk.magenta("waltz paycheck")} (aliased to \`waltz markpaid\`)
  ---
  Marks all current times as paid.  After one is paid, run this command to reset the invoice total back to "zero", and start the next billing period. Times generated after this is run will still be unpaid, however.


  ---
  ${chalk.magenta("waltz report")} (aliased to \`waltz invoice\`)
  ---
  Generate an invoice and save in the current directory as \`report.html\`, by default.

    \`--print\` Print to stdout instead of writing to file.
    \`--file my_report.html\` Redirect the report to a different file.

  ---
  ${chalk.magenta("waltz watch")}
  ---
  This works by monitoring filesystem changes. When a file is updated, Waltz will record your start time, and after an expiry period, Waltz will record your end time. Because accuracy isn't guaranteed, if you need by-the-second times, use waltz in and waltz out.

    \`--expires 10\` Amount of minutes required of inactivity to
                 be considered "waltzed out". (default = 10 minutes)
    \`-- watchdir some/dir\` The root folder to watch for file changes
    \`-- verbose, -v\` Log all of the changes that waltz registers
    \`--quiet, -q\` Don't print anything to stdout (errors will still be logged)
    \`--ignore [Ii]gnore_me\` An ignore regex for files that shouldn't trigger a clock in or out.
                          Defaults to \`([\/\\]\.|node_modules|\.timecard\.json|\.git)\`

  ---
  ${chalk.magenta("web")}
  ---
  Open the Waltz online app in your default browser.
    \`--print\` will print the url instead of opening the url in the browser.

  ---
  ${chalk.magenta("commit")}
  ---
  Make a commit, using git, containing any changes made to the current timecard.
  Behind the scenes, this is equivelent to \`git add .timecard.json && git commit -m "Change work time via waltz"\`
    \`--message\` or \`-m\` Change the commit message
 
  ---
  ${chalk.magenta("Other")}
  ---
  -h, --help              Show this help message
  -v, --version           Show the current waltz cli version
  `.replace(/(`.*?`)/g, (match) => {
    // highlight all of the commands that are in backticks (remove them, and
    // change the color)
    return chalk.cyan(match.slice(1).slice(0, -1));
  }));
}

module.exports = {
  run,
};
