import { useEffect } from "react";
import { socket } from "@/socket";
import { useSelector } from "react-redux";
import { authState } from "@/app/features/authSlice";

export const useSocketConnection = () => {
  const { meData } = useSelector(authState);

  useEffect(() => {
    if (!meData?.id) return;

    if (!socket.connected) {
      socket.connect();
      socket.emit("register", meData?.id);
    }

    return () => {
      socket.disconnect();
    };
  }, []);
};
