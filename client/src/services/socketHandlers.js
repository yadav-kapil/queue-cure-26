export const registerSocketHandlers = (socket, dispatch) => {
  const handleReceptionistJoined = ({ receptionist }) => {
    dispatch({
      type: "SET_RECEPTIONIST",
      payload: { receptionist },
    });
  };

  const handleReceptionistLeft = () => {
    dispatch({
      type: "SET_RECEPTIONIST",
      payload: { receptionistId: null },
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

  // 1. REGISTER HANDLERS
  socket.on("receptionist-joined", handleReceptionistJoined);
  socket.on("receptionist-left", handleReceptionistLeft);
  socket.on("queue-updated", handleQueueUpdated);
  socket.on("session-ended", handleSessionEnded);

  // 2. CLEAN UP
  return () => {
    socket.off("receptionist-joined", handleReceptionistJoined);
    socket.off("receptionist-left", handleReceptionistLeft);
    socket.off("queue-updated", handleQueueUpdated);
    socket.off("session-ended", handleSessionEnded);
  };
};