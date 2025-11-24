import { io } from "socket.io-client";
import { baseUrl } from "./constants";

export const socket = io(baseUrl, {
  autoConnect: false,
  transports: ["websocket"],
});
