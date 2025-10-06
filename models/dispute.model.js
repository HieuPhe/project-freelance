const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: "Contract", required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: String,
  evidence: Object,
  status: {
    type: String,
    enum: ["OPEN", "RESOLVED", "DISMISSED"],
    default: "OPEN",
  },
  resolvedAt: Date,
}, {
  timestamps: true,
});

const Dispute = mongoose.model("Dispute", disputeSchema, "disputes");
module.exports = Dispute;
