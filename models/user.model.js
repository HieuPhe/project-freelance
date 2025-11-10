const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    avatar: String,
    phone: String,
    description: String,
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
