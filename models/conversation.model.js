const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId },
      role: { type: String, enum: ["EMPLOYER", "FREELANCER"] },
    },
  ],
}, {
  timestamps: true,
});

const Conversation = mongoose.model("Conversation", conversationSchema, "conversations");
module.exports = Conversation;
