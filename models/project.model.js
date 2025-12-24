const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const projectSchema = new mongoose.Schema(
  {
    title: String,
    project_category_id: {
      type: String,
      default: "",
    },
    description: String,
    budget: {
      min: Number,
      max: Number,
    },
    deadline: Date,
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "CLOSED", "CANCELLED"],
      default: "OPEN",
    },
    hirerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    acceptedFreelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    featured: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema, "projects");

module.exports = Project;