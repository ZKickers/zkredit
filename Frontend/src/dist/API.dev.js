"use strict";

var _config = require("config");

var signup = function signup(e) {
  var response, data;
  return regeneratorRuntime.async(function signup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          e.preventDefault();
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch("".concat(_config.ZKREDIT_API, "/auth/signup"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          }));

        case 4:
          response = _context.sent;

          if (response.ok) {
            _context.next = 7;
            break;
          }

          throw new Error('Sign up failed');

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(response.json());

        case 9:
          data = _context.sent;
          console.log('Sign up successful:', data);
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);
          console.error('Error signing up', _context.t0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 13]]);
};