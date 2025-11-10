import React, { useState, useEffect } from 'react';
import { useSocket } from './socket/socket.js';
import Login from './components/Login.jsx';
import ChatRoom from './components/ChatRoom.jsx';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isConnected, connect, disconnect } = useSocket();

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
    connect(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    disconnect();
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatRoom
          username={username}
          onLogout={handleLogout}
          isConnected={isConnected}
        />
      )}
    </div>
  );
}

export default App;
