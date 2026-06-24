import { fetchSession } from "./sessionService";

export const registerSocketHandlers = (socket, dispatch, user) => {
  const handleReceptionistJoined = ({ receptionist }) => {
    dispatch({
      type: "SET_RECEPTIONIST",
      payload: { receptionist },
    });
  };

  const handleReceptionistLeft = () => {
    dispatch({
      type: "SET_RECEPTIONIST",
      payload: { receptionist: null },
    });
  };

  const handleQueueUpdated = ({ queue }) => {
    dispatch({
      type: "UPDATE_QUEUE",
      payload: { queue },
    });
  };

  const handleSessionEnded = () => {
    dispatch({
      type: "CLEAR_SESSION",
    });
  };

  const handleDoctorSessionStarted = ({ doctorId }) => {
    if (!user) return;
    const isReceptionist = user.role === "receptionist";
    const associatedDoctorId = user.associatedDoctorId
      ? (user.associatedDoctorId._id || user.associatedDoctorId)
      : null;

    if (isReceptionist && associatedDoctorId === doctorId) {
      fetchSession(dispatch);
    }
  };

  const handleReceptionistDisconnected = () => {
    dispatch({
      type: "CLEAR_RECEPTIONIST",
    });
  };

  // 1. REGISTER HANDLERS
  socket.on("receptionist-joined", handleReceptionistJoined);
  socket.on("receptionist-left", handleReceptionistLeft);
  socket.on("queue-updated", handleQueueUpdated);
  socket.on("session-ended", handleSessionEnded);
  socket.on("doctor-session-started", handleDoctorSessionStarted);
  socket.on("receptionist-disconnected", handleReceptionistDisconnected);

  // 2. CLEAN UP
  return () => {
    socket.off("receptionist-joined", handleReceptionistJoined);
    socket.off("receptionist-left", handleReceptionistLeft);
    socket.off("queue-updated", handleQueueUpdated);
    socket.off("session-ended", handleSessionEnded);
    socket.off("doctor-session-started", handleDoctorSessionStarted);
    socket.off("receptionist-disconnected", handleReceptionistDisconnected);
  };
};