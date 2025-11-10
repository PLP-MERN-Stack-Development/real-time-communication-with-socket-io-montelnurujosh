# Real-Time Chat Application with Socket.io

A fully functional real-time chat application built with Socket.io, React, and Node.js/Express. This application implements bidirectional communication between clients and server, supporting multiple chat rooms, private messaging, and real-time user presence.

## Features Implemented ✅

### Core Functionality
- ✅ Real-time messaging using Socket.io
- ✅ User authentication (username-based)
- ✅ Multiple chat rooms (#general, #random, #tech)
- ✅ Private messaging between users
- ✅ Real-time user presence (online/offline status)
- ✅ Typing indicators
- ✅ Message timestamps

### Advanced Features
- ✅ Room-based chat system with separate message history
- ✅ User list with online status
- ✅ System messages for user join/leave events
- ✅ Responsive UI design
- ✅ Connection status indicators

### Technical Implementation
- ✅ Node.js/Express server with Socket.io
- ✅ React front-end with Vite
- ✅ Socket.io client integration
- ✅ CORS configuration
- ✅ Environment variable configuration
- ✅ Modular component architecture

## Project Structure

```
real-time-communication-with-socket-io-montelnurujosh/
├── client/                 # React front-end
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── ChatRoom.jsx    # Main chat interface
│   │   │   ├── Login.jsx       # User login component
│   │   │   ├── MessageList.jsx # Message display component
│   │   │   ├── MessageInput.jsx # Message input component
│   │   │   ├── UserList.jsx     # Online users list
│   │   │   └── RoomList.jsx     # Chat rooms list
│   │   ├── socket/         # Socket.io client setup
│   │   │   └── socket.js    # Socket connection and hooks
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # React entry point
│   ├── .env               # Environment variables
│   └── package.json        # Client dependencies
├── server/                 # Node.js back-end
│   ├── server.js           # Main server file with Socket.io
│   ├── .env               # Environment variables
│   └── package.json        # Server dependencies
├── TODO.md                # Task tracking
├── Week5-Assignment.md    # Assignment requirements
└── README.md              # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd real-time-communication-with-socket-io-montelnurujosh
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**

   Create `.env` files in both `server/` and `client/` directories:

   **server/.env:**
   ```
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

   **client/.env:**
   ```
   VITE_SOCKET_URL=http://localhost:5000
   ```

5. **Start the application**

   **Terminal 1 - Start the server:**
   ```bash
   cd server
   npm start
   ```

   **Terminal 2 - Start the client:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**

   Open your browser and navigate to: `http://localhost:5174`

### Usage

1. Enter a username to join the chat
2. Switch between different chat rooms using the sidebar
3. Send messages in the current room
4. Click on a user in the user list to start a private conversation
5. View typing indicators and online status

## API Endpoints

### Server Endpoints
- `GET /` - Server status
- `GET /api/messages/:room?` - Get messages for a specific room (or general if no room specified)
- `GET /api/users` - Get list of online users
- `GET /api/rooms` - Get list of available chat rooms

### Socket Events

**Client → Server:**
- `user_join` - User joins the chat
- `send_message` - Send a message to current room
- `private_message` - Send a private message to another user
- `typing` - Indicate typing status
- `join_room` - Switch to a different room

**Server → Client:**
- `user_list` - List of online users
- `receive_message` - New message in current room
- `private_message` - Private message received
- `user_joined` / `user_left` - User presence events
- `typing_users` - List of currently typing users
- `room_list` - Available chat rooms
- `room_messages` - Messages for a specific room
- `user_joined_room` - User joined a room

## Technologies Used

- **Backend:** Node.js, Express.js, Socket.io, MongoDB Atlas
- **Frontend:** React, Vite, CSS3
- **Database:** MongoDB Atlas
- **Real-time Communication:** Socket.io
- **State Management:** React Hooks
- **Build Tools:** Vite, npm
- **Deployment:** Render (Backend), Vercel (Frontend)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Deployment Instructions

### Backend Deployment (Render)

1. **Create a MongoDB Atlas Database:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string

2. **Deploy to Render:**
   - Go to [Render](https://render.com)
   - Connect your GitHub repository
   - Create a new Web Service
   - Set the following environment variables:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `CLIENT_URL`: Your Vercel app URL (after frontend deployment)
     - `NODE_ENV`: `production`
   - Deploy the service

### Frontend Deployment (Vercel)

1. **Deploy to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Connect your GitHub repository
   - Set the build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variable:
     - `VITE_SOCKET_URL`: Your Render app URL
   - Deploy the application

2. **Update Backend CORS:**
   - After deploying the frontend, update the `CLIENT_URL` in your Render environment variables to match your Vercel app URL

### Environment Variables Setup

**For Local Development:**
- Copy `server/.env.example` to `server/.env` and fill in your values
- Copy `client/.env.example` to `client/.env` and fill in your values

**For Production:**
- Set environment variables in your deployment platforms (Render/Vercel)

## License

This project is part of an educational assignment and is not licensed for commercial use.