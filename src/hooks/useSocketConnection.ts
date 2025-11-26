// import { useEffect } from "react";
// import { socket } from "@/socket";
// import { authState } from "@/app/features/authSlice";
// import { useAppSelector } from "@/app/hooks";

// export const useSocketConnection = () => {
//   const { meData } = useAppSelector(authState);

//   useEffect(() => {
//     if (!meData?.id) return;

//     if (!socket.connected) {
//       socket.connect();
//       socket.emit("register", meData?.id);
//     }

//     return () => {
//       socket.disconnect();
//     };
//   }, []);
// };
