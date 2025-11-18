
// backend/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Message = require('../backend/models/Message');
const User = require('../backend/models/User');

dotenv.config();

// DB connection
mongoose.connect(process.env.MONGO_URI, { autoIndex: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));

// Simple health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Messages API
app.get('/api/messages', async (req, res) => {
  const room = req.query.room || 'global';
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
  const messages = await Message.find({ room }).sort({ createdAt: -1 }).limit(limit).lean();
  res.json(messages.reverse());
});

app.post('/api/messages', async (req, res) => {
  const { room = 'global', content, sender } = req.body;
  if (!content) return res.status(400).json({ message: 'Content is required' });
  const msg = await Message.create({
    room,
    senderId: sender?.id || null,
    senderEmail: sender?.email || null,
    senderName: sender?.name || sender?.email || 'Anon',
    content,
  });
  res.status(201).json(msg);
});

// Socket.IO
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_ORIGIN || '*', methods: ['GET', 'POST'] }
});

const onlineUsers = {}; // roomId -> [{id, name, email, socketId}]

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  let user = { id: socket.handshake.auth?.id || null, name: socket.handshake.auth?.name || 'Guest', email: socket.handshake.auth?.email || null };

  socket.on('join-room', (roomId) => {
    socket.join(roomId);

    // Add to online users
    if (!onlineUsers[roomId]) onlineUsers[roomId] = [];
    onlineUsers[roomId].push({ ...user, socketId: socket.id });

    io.to(roomId).emit('online-users', onlineUsers[roomId]);
    io.to(roomId).emit('system-message', { content: `${user.name} joined the room.` });
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    if (onlineUsers[roomId]) {
      onlineUsers[roomId] = onlineUsers[roomId].filter(u => u.socketId !== socket.id);
      io.to(roomId).emit('online-users', onlineUsers[roomId]);
      io.to(roomId).emit('system-message', { content: `${user.name} left the room.` });
    }
  });

  socket.on('send-message', async ({ roomId, content }) => {
    if (!content) return;
    const msg = await Message.create({
      room: roomId || 'global',
      senderId: user.id,
      senderEmail: user.email,
      senderName: user.name,
      content,
    });
    io.to(roomId || 'global').emit('new-message', msg);
  });

  socket.on('disconnecting', () => {
    // Remove from all rooms
    Object.keys(socket.rooms).forEach((roomId) => {
      if (onlineUsers[roomId]) {
        onlineUsers[roomId] = onlineUsers[roomId].filter(u => u.socketId !== socket.id);
        io.to(roomId).emit('online-users', onlineUsers[roomId]);
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
