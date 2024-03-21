"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _authContext = require("store/auth-context");

var _config = require("config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var WebSocket = function WebSocket(onReceive) {
  var auth = (0, _react.useContext)(_authContext.AuthContext);
  var socket = (0, _socket["default"])(_config.SOCKET_URL);

  var sendData = function sendData(data) {
    socket.emit("requestData", data);
  };

  (0, _react.useEffect)(function () {
    socket.on("connect", function () {
      console.log("Connected to WebSocket server");
      socket.emit("joinRoom", auth.accountId);
    }); // Listen for responses from the server

    socket.on("response", function (data) {
      console.log("Response from server:", data);
      onReceive(data);
    }); // Cleanup function

    return function () {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, [auth.accountId, onReceive]);
  return {
    socket: socket,
    sendData: sendData
  };
};

var _default = WebSocket;
exports["default"] = _default;