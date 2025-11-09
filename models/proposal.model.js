const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    // user_id: String,
    cart_id: String,
    userInfo: {
      fullName: String,
      email: String,
      cv: String,
    },
    projects: [
      {
        project_id: String,
        budget: {
          min: Number,
          max: Number,
        },
        deadline: Date,
      },
    ],
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

const Proposal = mongoose.model("Proposal", proposalSchema, "proposals");

module.exports = Proposal;
