import React, { useEffect, useRef } from 'react';
import './MessageList.css';

const MessageList = ({ messages, currentUser, selectedUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredMessages = selectedUser
    ? messages.filter(
        (msg) =>
          msg.isPrivate &&
          ((msg.sender === currentUser && msg.to === selectedUser.id) ||
           (msg.senderId === selectedUser.id && msg.to === currentUser))
      )
    : messages.filter((msg) => !msg.isPrivate);

  return (
    <div className="message-list">
      {filteredMessages.length === 0 ? (
        <div className="no-messages">
          {selectedUser ? 'No private messages yet.' : 'No messages yet. Start the conversation!'}
        </div>
      ) : (
        filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === currentUser ? 'own' : 'other'
            } ${message.system ? 'system' : ''}`}
          >
            {message.system ? (
              <div className="system-message">
                <span>{message.message}</span>
                <span className="timestamp">{formatTime(message.timestamp)}</span>
              </div>
            ) : (
              <>
                <div className="message-header">
                  <span className="sender">{message.sender}</span>
                  <span className="timestamp">{formatTime(message.timestamp)}</span>
                </div>
                <div className="message-content">{message.message}</div>
                {message.isPrivate && (
                  <div className="private-indicator">Private</div>
                )}
              </>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
