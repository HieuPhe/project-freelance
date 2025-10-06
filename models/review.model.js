const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  fromId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fromRole: { type: String, enum: ["EMPLOYER", "FREELANCER"], required: true },
  toId: { type: mongoose.Schema.Types.ObjectId, required: true },
  toRole: { type: String, enum: ["EMPLOYER", "FREELANCER"], required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
}, {
  timestamps: true,
});

const Review = mongoose.model("Review", reviewSchema, "reviews");
module.exports = Review;
