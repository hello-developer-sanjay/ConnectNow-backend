const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', ({ room }) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room ${room}`);
  });

  socket.on('videoCall', ({ room, offer, userId }) => {
    console.log(`Video call from ${socket.id} to user ${userId}`);
    io.to(userId).emit('videoOffer', { offer, caller: socket.id });
  });

  socket.on('videoAnswer', ({ room, answer, caller }) => {
    console.log(`Video answer from ${socket.id} to caller ${caller}`);
    io.to(caller).emit('videoAnswer', { answer });
  });

  socket.on('iceCandidate', ({ room, candidate }) => {
    console.log(`ICE candidate from ${socket.id}`);
    socket.to(room).emit('iceCandidate', { candidate });
  });

  socket.on('sendMessage', ({ room, message }) => {
    console.log(`Message from ${socket.id}: ${message}`);
    socket.to(room).emit('receiveMessage', message);
  });

  socket.on('endCall', ({ room }) => {
    console.log(`End call by ${socket.id}`);
    socket.to(room).emit('callDisconnected');
  });

  socket.on('callRejected', ({ room, caller }) => {
    console.log(`Call rejected by ${socket.id}`);
    io.to(caller).emit('callRejected');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
