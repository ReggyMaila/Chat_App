const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, index: true },
  email: String,
  name: String,
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
