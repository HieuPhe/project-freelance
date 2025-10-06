const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId },
  projectId: { type: mongoose.Schema.Types.ObjectId },
  reason: String,
  details: String,
  status: {
    type: String,
    enum: ["OPEN", "IN_REVIEW", "RESOLVED", "DISMISSED"],
    default: "OPEN",
  },
  resolvedAt: Date,
}, {
  timestamps: true,
});

const Report = mongoose.model("Report", reportSchema, "reports");
module.exports = Report;
