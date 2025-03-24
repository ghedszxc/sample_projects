import { io } from "socket.io-client";
export default function useSocket() {
  const config = useRuntimeConfig();
  const socket = io(`${config.public.API_VISITOR}visitor-events`);
  socket.on("connection", () => {
    console.log("Socket connected to: ", useRuntimeConfig().public.API_VISITOR);
  });
  const visitorSocket = io(`${config.public.API_REAL_TIME}visitor-events`, {
    autoConnect: false,
  });
  return {
    visitorSocket,
    socket,
  };
}
