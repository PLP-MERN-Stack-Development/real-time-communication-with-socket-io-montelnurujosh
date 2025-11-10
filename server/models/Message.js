const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  sender: {
    type: String,
    required: true,
    trim: true
  },
  senderId: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true,
    default: 'general'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  recipient: {
    type: String,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'system', 'file'],
    default: 'text'
  },
  readBy: [{
    userId: String,
    username: String,
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
messageSchema.index({ room: 1, timestamp: -1 });
messageSchema.index({ senderId: 1, timestamp: -1 });
messageSchema.index({ isPrivate: 1, senderId: 1, recipient: 1 });

module.exports = mongoose.model('Message', messageSchema);