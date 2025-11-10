// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Message = require('./models/Message');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages (in-memory for real-time state)
const connectedUsers = {}; // socketId -> user data
const typingUsers = {};
const rooms = ['general', 'random', 'tech']; // Default rooms
const userRooms = {}; // Track which room each user is in

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', async (username) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ username });

      if (user) {
        // Update existing user
        user.socketId = socket.id;
        user.isOnline = true;
        user.lastSeen = new Date();
        await user.save();
      } else {
        // Create new user
        user = new User({
          username,
          socketId: socket.id,
          isOnline: true
        });
        await user.save();
      }

      connectedUsers[socket.id] = {
        username: user.username,
        id: user._id.toString(),
        socketId: socket.id
      };

      userRooms[socket.id] = 'general'; // Default room
      socket.join('general');

      // Get all online users
      const onlineUsers = await User.find({ isOnline: true }).select('username _id socketId');
      const userList = onlineUsers.map(u => ({
        username: u.username,
        id: u._id.toString(),
        socketId: u.socketId
      }));

      io.emit('user_list', userList);
      io.emit('user_joined', { username, id: user._id.toString() });
      io.emit('room_list', rooms);
      console.log(`${username} joined the chat`);
    } catch (error) {
      console.error('Error handling user join:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  // Handle chat messages
  socket.on('send_message', async (messageData) => {
    try {
      const currentRoom = userRooms[socket.id] || 'general';
      const user = connectedUsers[socket.id];

      if (!user) return;

      // Save message to database
      const message = new Message({
        content: messageData.message,
        sender: user.username,
        senderId: user.id,
        room: currentRoom,
        timestamp: new Date(),
        messageType: 'text'
      });

      await message.save();

      const messageResponse = {
        id: message._id.toString(),
        message: message.content,
        sender: message.sender,
        senderId: message.senderId,
        timestamp: message.timestamp.toISOString(),
        room: message.room,
      };

      io.to(currentRoom).emit('receive_message', messageResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    if (connectedUsers[socket.id]) {
      const username = connectedUsers[socket.id].username;
      const currentRoom = userRooms[socket.id] || 'general';

      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }

      io.to(currentRoom).emit('typing_users', Object.values(typingUsers));
    }
  });

  // Handle private messages
  socket.on('private_message', async ({ to, message }) => {
    try {
      const user = connectedUsers[socket.id];
      if (!user) return;

      // Save private message to database
      const privateMessage = new Message({
        content: message,
        sender: user.username,
        senderId: user.id,
        recipient: to,
        timestamp: new Date(),
        isPrivate: true,
        messageType: 'text'
      });

      await privateMessage.save();

      const messageData = {
        id: privateMessage._id.toString(),
        message: privateMessage.content,
        sender: privateMessage.sender,
        senderId: privateMessage.senderId,
        timestamp: privateMessage.timestamp.toISOString(),
        isPrivate: true,
        to: to,
      };

      socket.to(to).emit('private_message', messageData);
      socket.emit('private_message', messageData);
    } catch (error) {
      console.error('Error sending private message:', error);
      socket.emit('error', { message: 'Failed to send private message' });
    }
  });

  // Handle room switching
  socket.on('join_room', async (roomName) => {
    try {
      if (rooms.includes(roomName)) {
        const user = connectedUsers[socket.id];
        if (!user) return;

        const previousRoom = userRooms[socket.id];
        if (previousRoom) {
          socket.leave(previousRoom);
        }
        socket.join(roomName);
        userRooms[socket.id] = roomName;

        // Get recent messages for the room from database
        const roomMessages = await Message.find({ room: roomName, isPrivate: false })
          .sort({ timestamp: -1 })
          .limit(50)
          .select('content sender senderId timestamp room _id');

        const formattedMessages = roomMessages.reverse().map(msg => ({
          id: msg._id.toString(),
          message: msg.content,
          sender: msg.sender,
          senderId: msg.senderId,
          timestamp: msg.timestamp.toISOString(),
          room: msg.room,
        }));

        socket.emit('room_messages', formattedMessages);

        io.to(roomName).emit('user_joined_room', {
          username: user.username,
          room: roomName
        });
      }
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    try {
      const user = connectedUsers[socket.id];
      if (user) {
        const currentRoom = userRooms[socket.id] || 'general';

        // Update user status in database
        await User.findByIdAndUpdate(user.id, {
          isOnline: false,
          lastSeen: new Date()
        });

        io.to(currentRoom).emit('user_left', { username: user.username, id: user.id });
        console.log(`${user.username} left the chat`);

        // Get updated online users list
        const onlineUsers = await User.find({ isOnline: true }).select('username _id socketId');
        const userList = onlineUsers.map(u => ({
          username: u.username,
          id: u._id.toString(),
          socketId: u.socketId
        }));

        io.emit('user_list', userList);
        io.emit('userListUpdate', userList); // Additional event for real-time updates
      }

      delete connectedUsers[socket.id];
      delete typingUsers[socket.id];
      delete userRooms[socket.id];

      io.emit('typing_users', Object.values(typingUsers));
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

// API routes
app.get('/api/messages/:room?', async (req, res) => {
  try {
    const room = req.params.room || 'general';
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.find({
      room: room,
      isPrivate: false
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .select('content sender senderId timestamp room _id');

    const formattedMessages = messages.reverse().map(msg => ({
      id: msg._id.toString(),
      message: msg.content,
      sender: msg.sender,
      senderId: msg.senderId,
      timestamp: msg.timestamp.toISOString(),
      room: msg.room,
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ isOnline: true }).select('username _id socketId');
    const userList = users.map(u => ({
      username: u.username,
      id: u._id.toString(),
      socketId: u.socketId
    }));
    res.json(userList);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle server errors gracefully
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using it.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});

startServer();

module.exports = { app, server, io };