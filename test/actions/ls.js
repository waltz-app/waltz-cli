"use strict";
const action = require("../../lib/actions/ls"),
      sinon = require("sinon"),
      card = require("../../lib/card"),
      assert = require("assert"),
      stripAnsi = require("strip-ansi"),
      helpers = require("../helpers");

describe('ls', function() {
  describe('unpaid times', function() {
    beforeEach(() => {
      sinon.stub(card, "getCard").resolves({
        "card": [
          {
            "date": "Sat Jun 21 2003",
            "times": [
              {
                "by": "user",
                "start": "07:59:59",
                "end": "08:59:59"
              },
              {
                "by": "user",
                "start": "13:06:36",
                "end": "14:06:36"
              }
            ]
          },
          {
            "date": "Sun Jun 22 2003",
            "disabled": "Sun Jun 22 2003",
            "times": [
              {
                "by": "user",
                "start": "07:59:59",
                "end": "08:59:59"
              },
              {
                "by": "user",
                "start": "13:06:36",
                "end": "14:06:36"
              }
            ]
          },
        ]
      });
    });

    it("should list all times", function(done) {
      action().then((data) => {
        let parsed = stripAnsi(data);
        assert.deepEqual(parsed, helpers.unindent(`
          Unpaid Hours / Paid Hours:
          u Sat Jun 21 2003\t\t 07:59:59 - 08:59:59
          u Sat Jun 21 2003\t\t 13:06:36 - 14:06:36
          p Sun Jun 22 2003\t\t 07:59:59 - 08:59:59
          p Sun Jun 22 2003\t\t 13:06:36 - 14:06:36
          About 2 hours, 0 minutes, and 0 seconds`));
        done();
      }).catch(done)
    });
  });
});
