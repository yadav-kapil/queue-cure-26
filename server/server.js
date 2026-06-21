import { Server } from "socket.io";
import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import http from 'http'
import { initializeSocket } from "./src/socket/index.socket.js";

const startServer = async () => {
  try {
    await connectDB();
    
    const server = http.createServer(app)

    const io = new Server(server, {
      cors: {
        origin: config.CLIENT_URI,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
      }
    });
    app.set("io", io)
    initializeSocket(io);

    server.listen(config.PORT, () => {
      console.log(`Server Listening at Port : ${config.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
