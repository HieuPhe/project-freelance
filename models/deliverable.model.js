const mongoose = require("mongoose");

const deliverableSchema = new mongoose.Schema({
  milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: "Milestone", required: true },
  title: { type: String, required: true },
  note: String,
  fileUrl: String,
  submittedAt: { type: Date, default: Date.now },
});

const Deliverable = mongoose.model("Deliverable", deliverableSchema, "deliverables");
module.exports = Deliverable;
