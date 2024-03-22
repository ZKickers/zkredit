"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendThreshold = void 0;

var _config = require("config");

var sendThreshold = function sendThreshold(props) {
  var token, threshold, txId, url, response;
  return regeneratorRuntime.async(function sendThreshold$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = props.token, threshold = props.threshold, txId = props.txId;
          url = "".concat(_config.ZKREDIT_API, "/Creditor/trigger-threshold");
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(url, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: token
            },
            body: JSON.stringify({
              threshold: threshold,
              txId: txId
            })
          })["catch"](function (err) {
            throw new Error("Error connecting to the server!");
          }));

        case 4:
          response = _context.sent;

          if (!(response.status === 200)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", response);

        case 7:
          throw new Error(response.statusText);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.sendThreshold = sendThreshold;