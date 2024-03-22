"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendProofStatus = void 0;

var _config = require("config");

var sendProofStatus = function sendProofStatus(transactionId, isAccepted, token) {
  var url, data, response, message;
  return regeneratorRuntime.async(function sendProofStatus$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = "".concat(_config.BACKEND_URL, "/verifyTx");
          data = {
            txId: transactionId,
            accepted: isAccepted
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(url, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: "".concat(token)
            },
            body: JSON.stringify(data)
          })["catch"](function (error) {
            console.log(error);
            throw new Error("Problem connecting with the server!");
          }));

        case 4:
          response = _context.sent;

          if (!(response.status !== 200)) {
            _context.next = 10;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(response.text());

        case 8:
          message = _context.sent;
          throw new Error(message);

        case 10:
          return _context.abrupt("return", response.json());

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.sendProofStatus = sendProofStatus;