const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  role: { type: String, enum: ["EMPLOYER", "FREELANCER"], required: true },
  type: { type: String, enum: ["TEXT", "FILE"], default: "TEXT" },
  content: String,
  fileUrl: String,
  readBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId },
      at: { type: Date, default: Date.now },
    },
  ],
}, {
  timestamps: true,
});

const Chat = mongoose.model("Chat", chatSchema, "chats");
module.exports = Chat;
