const  mongoose  = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const projectSchema = new mongoose.Schema(
  {
    title: String,
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
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema, "projects");

module.exports = Project;
