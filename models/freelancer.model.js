const mongoose = require("mongoose");
const generate = require(".././helpers/generate");

const FreelancerSkillSchema = new mongoose.Schema({
  name: String,
  slug: {
    type: String,
    slug: "title",
    unique: true,
  },
  level: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
});

const PortfolioItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  linkUrl: String,
  imageUrl: String,
});

const freelancerSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: generate.generateRandomString(20),
    },
    headline: String,
    avatar: String,
    bio: String,
    location: String,
    skills: {
      type: [FreelancerSkillSchema],
      default: [],
    },
    portfolio: {
      type: [PortfolioItemSchema],
      default: [],
    },
    rating: {
      avg: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

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

const Freelancer = mongoose.model("Freelancer", freelancerSchema, "freelancers");

module.exports = Freelancer;
