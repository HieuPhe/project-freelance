const mongoose = require("mongoose");
const generate = require(".././helpers/generate");

const employerSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: generate.generateRandomString(20),
    },
    companyName: String,
    avatar: String,
    headline: String,
    bio: String,
    location: String,
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Employer = mongoose.model("Employer", employerSchema, "employers");

module.exports = Employer;
