import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome to Socket.io Chat</h1>
        <p>Enter your username to join the conversation</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
            required
          />
          <button type="submit" className="login-btn">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
