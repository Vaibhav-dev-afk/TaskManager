
const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        socket.on('joinProject', (projectId) => {
            socket.join(projectId);
            console.log(`👤 User joined project room: ${projectId}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketHandler;
