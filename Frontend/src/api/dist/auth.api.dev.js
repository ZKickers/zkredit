"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUser = exports.loginUser = exports.registerUser = void 0;

var _config = require("config");

var registerUser = function registerUser(user) {
  var url, response, message;
  return regeneratorRuntime.async(function registerUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = "".concat(_config.BACKEND_URL, "/auth/signup");
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch(url, {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(user)
          })["catch"](function (error) {
            throw new Error("Problem connecting with the server!");
          }));

        case 3:
          response = _context.sent;

          if (!(response.status !== 200)) {
            _context.next = 9;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(response.text());

        case 7:
          message = _context.sent;
          throw new Error(message);

        case 9:
          return _context.abrupt("return", response);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.registerUser = registerUser;

var loginUser = function loginUser(user) {
  var url, response;
  return regeneratorRuntime.async(function loginUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          url = "".concat(_config.BACKEND_URL, "/auth/login");
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch(url, {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(user)
          })["catch"](function (error) {
            throw new Error("Problem connecting with the server!");
          }));

        case 3:
          response = _context2.sent;

          if (!(response.status === 401)) {
            _context2.next = 8;
            break;
          }

          throw new Error("Invalid credentials");

        case 8:
          if (!(response.status !== 200)) {
            _context2.next = 10;
            break;
          }

          throw new Error(response.status);

        case 10:
          return _context2.abrupt("return", response);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.loginUser = loginUser;

var getUser = function getUser(token) {
  var url, response, user;
  return regeneratorRuntime.async(function getUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          url = "".concat(_config.BACKEND_URL, "/auth");
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetch(url, {
            method: "GET",
            headers: {
              Authorization: "".concat(token)
            }
          }));

        case 3:
          response = _context3.sent;

          if (!(response.status !== 200)) {
            _context3.next = 6;
            break;
          }

          throw new Error(response.status);

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          user = _context3.sent;
          return _context3.abrupt("return", user);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getUser = getUser;