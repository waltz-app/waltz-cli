"use strict";
const card = require("../card");

module.exports = function(cb) {
  card.getCard().then((timecard) => {
    card.getReportTemplate(timecard.reportFormat || "default").then((contents) => {
      let ejs_data = card.getTimecardRenderDetails(timecard);
      let report = ejs.render(contents.toString(), ejs_data);
      if (args.print) {
        // push to stdout
        console.log(report);
        cb();
      } else {
        // write to disk
        fs.writeFile(args.file || "report.html", report, (err) => {
          if (err) {
            cb(err);
          } else {
            console.log("Wrote to", args.file || "report.html");
            cb();
          }
        });
      }
    }).catch(cb);
  }).catch(cb);
}
