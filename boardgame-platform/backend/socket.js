// 4. socket.js 생성
const { Server } = require('socket.io');

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    console.log('사용자 연결:', socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id}가 방 ${roomId}에 입장`);
    });

    socket.on('chatMessage', (data) => {
      io.to(data.roomId).emit('chatMessage', data);
    });

    socket.on('disconnect', () => {
      console.log('사용자 연결 종료:', socket.id);
    });
  });

  return io;
};
