import React, { useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "store/auth-context";
import { SOCKET_URL } from "config";

const WebSocket = (onReceive) => {
  const auth = useContext(AuthContext);
  const socket = io(SOCKET_URL);

  const sendData = (data) => {
    socket.emit("requestData", data);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.emit("joinRoom", auth.accountId);
    });

    // Listen for responses from the server
    socket.on("response", (data) => {
      console.log("Response from server:", data);
      onReceive(data);
    });

    // Cleanup function
    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, [auth.accountId, onReceive]);

  return {
    socket,
    sendData,
  };
};

export default WebSocket;
