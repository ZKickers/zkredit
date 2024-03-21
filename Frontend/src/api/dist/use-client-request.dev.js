"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _react = require("react");

var _authContext = _interopRequireDefault(require("store/auth-context"));

var _config = require("config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var useClientRequest = function useClientRequest() {
  var auth = (0, _react.useContext)(_authContext["default"]);
  var url = "".concat(_config.ZKREDIT_API, "/ClientRequest");

  var clientRequest = function clientRequest(data) {
    var response;
    return regeneratorRuntime.async(function clientRequest$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = _objectSpread({}, data, {
              username: auth.username
            });
            _context.next = 3;
            return regeneratorRuntime.awrap(_axios["default"].post(url, data, {
              headers: {
                Authorization: "".concat(auth.token)
              }
            }));

          case 3:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  return clientRequest;
};

var _default = useClientRequest;
exports["default"] = _default;