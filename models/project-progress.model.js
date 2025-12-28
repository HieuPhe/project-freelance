const mongoose = require("mongoose");

const projectProgressSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    percent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ProjectProgress = mongoose.model("ProjectProgress", projectProgressSchema, "project-progress");

module.exports = ProjectProgress;
