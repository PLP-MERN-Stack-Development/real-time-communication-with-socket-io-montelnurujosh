import React, { useState, useRef, useEffect } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, onTyping, placeholder }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      onTyping(false);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping(e.target.value.length > 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="send-btn"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
