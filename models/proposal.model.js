const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true },
  price: { type: Number, required: true },
  durationDays: Number,
  coverLetter: String,
  attachments: [
    {
      fileUrl: String,
      fileName: String,
      fileSize: Number,
    },
  ],
  status: {
    type: String,
    enum: ["PENDING", "SHORTLISTED", "ACCEPTED", "REJECTED", "WITHDRAWN"],
    default: "PENDING",
  },
}, {
  timestamps: true,
});

const Proposal = mongoose.model("Proposal", proposalSchema, "proposals");
module.exports = Proposal;
