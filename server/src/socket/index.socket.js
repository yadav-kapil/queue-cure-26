export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on("message", (data) => {
            console.log(data);
            io.emit("response", "response from socket ...")
        })
    })
}