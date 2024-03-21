import io from "socket.io-client";
import { ZKREDIT_API } from "config";

const WebSocket = (oneResponse) => {
  const socket = io(ZKREDIT_API);

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    socket.emit("joinRoom", "acc_8k2iltctv");
  });

  socket.on("response", (data) => {
    console.log("Response from server:", data);
    oneResponse(data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

  return socket;
};

export default WebSocket;
