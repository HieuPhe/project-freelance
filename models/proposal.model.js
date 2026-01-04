const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    // Giữ lại nếu trước đó bạn đã dùng (không bắt buộc dùng nữa)
    user_id: String,

    // Freelancer gửi đề xuất
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Giỏ công việc (nếu muốn liên kết)
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart"
    },

    // Thông tin cá nhân freelancer nhập ở form checkout
    userInfo: {
      fullName: String,
      email: String,
    },

    // Danh sách công việc trong đề xuất
    projects: [
      {
        project_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
          required: true
        },
        budget: {
          min: Number,
          max: Number
        },
        deadline: Date
      }
    ],

    status: {
      type: String,
      enum: ["SUBMITTED", "ACCEPTED", "REJECTED"],
      default: "SUBMITTED"
    },

    deleted: {
      type: Boolean,
      default: false
    },
    deleteAt: Date
  },
  {
    timestamps: true
  }
);

const Proposal = mongoose.model("Proposal", proposalSchema, "proposals");

module.exports = Proposal;