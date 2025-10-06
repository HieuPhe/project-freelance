const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true },
  terms: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"],
    default: "ACTIVE",
  },
}, {
  timestamps: true,
});

const Contract = mongoose.model("Contract", contractSchema, "contracts");
module.exports = Contract;
