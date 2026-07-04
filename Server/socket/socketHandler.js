const socketHandler = (io) => {
    io.on('connection', (socket) => {
        socket.on('joinProject', (projectId) => {
            socket.join(projectId);
        });

        socket.on('disconnect', () => {
        });
    });
};

module.exports = socketHandler;