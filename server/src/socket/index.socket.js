import Session from "../models/session.model.js";

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-session", async ({ sessionId, receptionistId }) => {
      socket.join(sessionId);
      console.log(`Socket ${socket.id} joined session room: ${sessionId}`);

      socket.userId = receptionistId;
      socket.role = receptionistId ? "receptionist" : "doctor";
      socket.sessionId = sessionId;

      try {
        const session = await Session.findById(sessionId);
        if (session) {
          if (receptionistId) {
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
          } else {
            io.emit("doctor-session-started", { doctorId: session.doctorId });
            console.log(`Doctor session started event broadcasted globally for doctor: ${session.doctorId}`);
          }
        }
      } catch (error) {
        console.error("Error inside join-session handler:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      if (socket.role === "receptionist" && socket.sessionId) {
        const updatedSession = await Session.findByIdAndUpdate(
              socket.sessionId,
              { receptionistId : null },
              { new: true }
            )
        io.to(socket.sessionId).emit("receptionist-disconnected", { receptionistId: socket.userId });
        console.log(`Receptionist ${socket.userId} disconnected socket. Emitted receptionist-disconnected to room: ${socket.sessionId}`);
      }
    });
  });
};