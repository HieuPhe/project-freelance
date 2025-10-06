const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  role: { type: String, enum: ["EMPLOYER", "FREELANCER"], required: true },
  type: { type: String, enum: ["PROJECT_NEW", "PROPOSAL_NEW", "MESSAGE_NEW", "MILESTONE_UPDATE"], required: true },
  payload: Object,
  isRead: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Notification = mongoose.model("Notification", notificationSchema, "notifications");
module.exports = Notification;
