const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
  title: { type: String, required: true },
  description: String,
  skills: [
    {
      skillId: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
      name: String,
      slug: String,
    },
  ],
  budget: {
    min: Number,
    max: Number,
    type: { type: String, enum: ["FIXED", "HOURLY"], required: true },
  },
  deadline: Date,
  attachments: [
    {
      fileUrl: String,
      fileName: String,
      fileSize: Number,
    },
  ],
  status: {
    type: String,
    enum: ["OPEN", "IN_PROGRESS", "CLOSED", "CANCELLED"],
    default: "OPEN",
  },
}, {
  timestamps: true,
});

const Project = mongoose.model("Project", projectSchema, "projects");
module.exports = Project;
