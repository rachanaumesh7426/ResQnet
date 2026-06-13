const connectedUsers = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('user:join', ({ userId, role }) => {
      connectedUsers.set(socket.id, { userId, role });
      socket.join(`role:${role}`);
      io.emit('users:count', connectedUsers.size);
      console.log(`👤 User ${userId} (${role}) joined`);
    });

    socket.on('location:update', (data) => {
      socket.broadcast.emit('location:update', data);
    });

    socket.on('sos:send', (data) => {
      io.to('role:responder').to('role:admin').emit('sos:received', data);
    });

    socket.on('incident:respond', (data) => {
      io.emit('incident:responder_update', data);
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
      io.emit('users:count', connectedUsers.size);
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};
