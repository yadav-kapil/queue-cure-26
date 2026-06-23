import { createContext, useContext, useReducer, useEffect } from "react";
import { sessionReducer, initialState } from "./sessionReducer";
import { fetchSession } from "../../services/sessionService";
import { registerSocketHandlers } from "../../services/socketHandlers";
import { useAuth } from "../auth/AuthContext";
import { io } from "socket.io-client";

// Define and export the socket instance globally to avoid recreating it on renders
export const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3003", {
  withCredentials: true,
  autoConnect: false, // Manage connection explicitly on component mount
});

const SessionContext = createContext(null);

export const SessionContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const { user } = useAuth();

  // Fetch session on mount
  useEffect(() => {
    fetchSession(dispatch);
  }, []);

  // Effect 1: Handle joining room when session becomes active/changes, or on socket connection/reconnection
  useEffect(() => {
    if (!state.session || !state.session?._id) return;

    const sessionId = state.session._id;
    const receptionistId =
      user?.role === "receptionist" ? (user?._id || user?.id) : null;

    const joinRoom = () => {
      socket.emit("join-session", {
        sessionId,
        receptionistId,
      });
      console.log(
        `Joined session room: ${sessionId} (receptionistId: ${receptionistId})`,
      );
    };

    // 1. Join immediately if socket is already connected
    if (socket.connected) {
      joinRoom();
    }

    // 2. Listen to the 'connect' event to handle automatic reconnects (e.g. after WiFi drop)
    socket.on("connect", joinRoom);

    // Cleanup connect listener when session changes or provider unmounts
    return () => {
      socket.off("connect", joinRoom);
    };
  }, [state.session?._id]);

  // Effect 2: Connect socket and register event listeners on mount, disconnect on unmount
  useEffect(() => {
    socket.connect();
    const cleanup = registerSocketHandlers(socket, dispatch, user);

    return () => {
      cleanup();
      socket.disconnect();
      dispatch({ type: "CLEAR_SESSION" });
    };
  }, [user?._id, user?.associatedDoctorId]);

  return (
    <SessionContext.Provider
      value={{
        ...state,
        dispatch,
        socket,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used inside a SessionContextProvider");
  }

  return context;
};
