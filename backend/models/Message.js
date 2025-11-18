const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: { type: String, default: 'global', index: true },
  senderId: String,
  senderEmail: String,
  senderName: String,
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);

