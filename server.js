// server.js

const express = require('express');
const dotenv = require('dotenv');
const http = require('http'); 

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const socketHandler = require('./socket');
const cors = require('cors');
const socketIo = require('socket.io');

const { protect } = require('./middleware/authMiddleware');
const app = express();
const server = http.createServer(app);


const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());
app.get('/protectedRoute', protect, (req, res) => {
    res.send('This route is protected and requires a valid token');
});
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to My API');
});
const PORT = process.env.PORT || 5000;
socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
