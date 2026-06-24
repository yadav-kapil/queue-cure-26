import { createContext, useContext, useReducer, useEffect } from "react";
import { sessionReducer, initialState } from "./sessionReducer";
import { fetchSession } from "../../services/sessionService";
import { registerSocketHandlers } from "../../services/socketHandlers";
import { useAuth } from "../auth/AuthContext";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
  withCredentials: true,
  autoConnect: false,
});

const SessionContext = createContext(null);

export const SessionContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    fetchSession(dispatch);
  }, []);

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

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [state.session?._id, user]);

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
