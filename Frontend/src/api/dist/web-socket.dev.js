"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _socket = require("socket.io-client");

var _authContext = _interopRequireDefault(require("store/auth-context"));

var _config = require("config");

var _react = require("react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var WebSocket = function WebSocket(onReceive) {
  var auth = (0, _react.useContext)(_authContext["default"]);
  var socket = (0, _socket.io)(_config.SOCKET_URL);

  var sendData = function sendData(data) {
    socket.emit("requestData", data);
  };

  (0, _react.useEffect)(function () {
    socket.on("connect", function () {
      console.log("Connected to WebSocket server");
      socket.emit("joinRoom", auth.accountId);
    });
    socket.on("response", function (data) {
      console.log("Response from server:", data);
      onReceive(data);
    });
    console.log(auth.accountId);
    return function () {
      socket.disconnect();
    };
  }, [auth.accountId, onReceive, socket]);
  return {
    socket: socket,
    sendData: sendData
  };
};

var _default = WebSocket;
exports["default"] = _default;