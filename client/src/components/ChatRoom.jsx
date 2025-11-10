import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../socket/socket.js';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import UserList from './UserList.jsx';
import RoomList from './RoomList.jsx';
import './ChatRoom.css';

const ChatRoom = ({ username, onLogout, isConnected }) => {
  const {
    messages,
    users,
    typingUsers,
    currentRoom,
    rooms,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    joinRoom,
  } = useSocket();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSendMessage = (message) => {
    if (selectedUser) {
      sendPrivateMessage(selectedUser.id, message);
    } else {
      sendMessage(message);
    }
  };

  const handleTyping = (typing) => {
    if (typing !== isTyping) {
      setIsTyping(typing);
      setTyping(typing);

      if (typing) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setTyping(false);
        }, 3000);
      }
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleBackToGlobal = () => {
    setSelectedUser(null);
  };

  const handleRoomSelect = (roomName) => {
    joinRoom(roomName);
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div className="header-info">
          <h2>
            {selectedUser ? `Private Chat with ${selectedUser.username}` : `#${currentRoom} Chat`}
          </h2>
          <div className="connection-status">
            <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
        </div>
        <div className="header-actions">
          {selectedUser && (
            <button onClick={handleBackToGlobal} className="back-btn">
              Back to Room
            </button>
          )}
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="chat-content">
        <div className="sidebar">
          <RoomList
            currentRoom={currentRoom}
            onRoomSelect={handleRoomSelect}
          />
        </div>

        <div className="messages-section">
          <MessageList
            messages={messages}
            currentUser={username}
            selectedUser={selectedUser}
          />
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}
          <MessageInput
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            placeholder={
              selectedUser
                ? `Message ${selectedUser.username}...`
                : `Message #${currentRoom}...`
            }
          />
        </div>

        <div className="users-section">
          <UserList
            users={users}
            currentUser={username}
            onUserSelect={handleUserSelect}
            selectedUser={selectedUser}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
