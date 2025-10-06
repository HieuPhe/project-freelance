const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: "Contract", required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  amount: Number,
  state: {
    type: String,
    enum: ["OPEN", "SUBMITTED", "APPROVED", "REJECTED"],
    default: "OPEN",
  },
}, {
  timestamps: true,
});

const Milestone = mongoose.model("Milestone", milestoneSchema, "milestones");
module.exports = Milestone;
