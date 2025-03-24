import { io } from "socket.io-client";
export default function useSocket() {
  const config = useRuntimeConfig();
  const visitorSocket = io(`${config.public.API_REAL_TIME}visitor-events`, {
    autoConnect: false,
  });
  const organizationSocket = io(
    `${config.public.API_REAL_TIME}organization-events`,
    {
      autoConnect: false,
    },
  );
  const feedbackSocket = io(`${config.public.API_REAL_TIME}feedback-events`, {
    autoConnect: false,
  });
  const incidentSocket = io(`${config.public.API_REAL_TIME}incident-events`, {
    autoConnect: false,
  });
  return {
    visitorSocket,
    organizationSocket,
    feedbackSocket,
    incidentSocket,
  };
}