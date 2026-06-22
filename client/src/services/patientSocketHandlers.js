export const registerPatientSocketHandlers = (socket, fetchPatientSession, setIsSessionEnded) => {
  const handleQueueChanged = () => {
    // When the queue changes (patient added, removed, token advanced, etc.),
    // re-fetch the data to get the latest status and wait time.
    fetchPatientSession();
  };

  const handleSessionEnded = () => {
    // When the doctor ends the session
    setIsSessionEnded(true);
  };

  // 1. REGISTER HANDLERS
  socket.on("queue-updated", handleQueueChanged); // Matches backend emission 'queue-updated'
  socket.on("session-ended", handleSessionEnded); // Matches backend emission 'session-ended'

  // 2. CLEAN UP
  return () => {
    socket.off("queue-updated", handleQueueChanged);
    socket.off("session-ended", handleSessionEnded);
  };
};
