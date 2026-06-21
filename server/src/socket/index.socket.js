import Session from "../models/session.model.js";

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-session", async ({ sessionId, receptionistId }) => {
      socket.join(sessionId);
      console.log(`Socket ${socket.id} joined session room: ${sessionId}`);

      if (receptionistId) {
        try {
          const updatedSession = await Session.findByIdAndUpdate(
            sessionId,
            { receptionistId },
            { new: true }
          ).populate("receptionistId", "fullName username");

          if (updatedSession && updatedSession.receptionistId) {
            const receptionist = {
              _id: updatedSession.receptionistId._id,
              name: updatedSession.receptionistId.fullName || updatedSession.receptionistId.username,
              connectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            
            io.to(sessionId).emit("receptionist-joined", { receptionist });
            console.log(`Receptionist ${receptionist.name} joined session: ${sessionId}`);
          }
        } catch (error) {
          console.error("Error updating session receptionist:", error);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};