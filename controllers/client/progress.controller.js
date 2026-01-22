const mongoose = require("mongoose");
const Project = require("../../models/project.model");
const ProjectProgress = require("../../models/project-progress.model");
const Notification = require("../../models/notification.model");


const progressSocket = require("../../sockets/client/progress.socket");

/**
 * Freelancer xem + cập nhật tiến độ
 */
module.exports.freelancerView = async (req, res) => {
  // GẮN SOCKET – GIỐNG CHAT
  progressSocket(res);

  const { projectId } = req.params;

  const project = await Project.findOne({
    _id: projectId,
    acceptedFreelancerId: res.locals.user._id,
    status: "IN_PROGRESS",
    deleted: false,
  });

  if (!project) {
    req.flash("error", "Bạn không có quyền cập nhật công việc này");
    return res.redirect("/freelancer/jobs");
  }

  const progressList = await ProjectProgress.find({
    projectId: projectId,
    deleted: false,
  })
    .sort({ createdAt: -1 })
    .populate("freelancerId");

  res.render("client/pages/freelancer/progress", {
    pageTitle: "Cập nhật tiến độ",
    project,
    projectId: project._id.toString(),
    progressList,
  });
};

/**
 * Freelancer gửi cập nhật
 */
module.exports.create = async (req, res) => {
  const { projectId } = req.params;
  const user = res.locals.user;
  const { content, percent } = req.body;

  if (!content || percent === undefined) {
    req.flash("error", "Vui lòng nhập đầy đủ thông tin");
    return res.redirect(`/progress/freelancer/${projectId}`);
  }

  const project = await Project.findOne({
    _id: projectId,
    acceptedFreelancerId: user._id,
    status: "IN_PROGRESS",
    deleted: false,
  });

  if (!project) {
    req.flash("error", "Không thể cập nhật tiến độ");
    return res.redirect("/freelancer/jobs");
  }

  const progress = await ProjectProgress.create({
    projectId: projectId, // ✅ FIX LỖI VALIDATION
    freelancerId: user._id,
    content,
    percent,
  });

  await Project.findByIdAndUpdate(projectId, {
    progressPercent: percent,
  });

  // SOCKET EMIT → PROJECT ROOM (phần này giữ nếu bạn cần realtime progress)
  global._io.to(projectId).emit("SERVER_RETURN_PROGRESS", {
    projectId,
    freelancerName: user.fullName,
    content,
    percent,
    createdAt: progress.createdAt,
  });

  // sau khi tạo progress xong
  const notification = await Notification.create({
    userId: project.hirerId,
    type: "PROGRESS_UPDATE",
    title: "Cập nhật tiến độ công việc",
    content: `${user.fullName} đã cập nhật tiến độ (${percent}%)`,
    projectId: project._id,
    fromUser: user._id,
  });

  if (global._io) {
    global._io.to(`user_${project.hirerId}`).emit("NOTIFICATION_NEW", {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      content: notification.content,
      projectId: project._id,
      isRead: false,
      createdAt: notification.createdAt,
    });
  }

  req.flash("success", "Đã cập nhật tiến độ");
  return res.redirect(`/progress/freelancer/${projectId}`);
};

/**
 * Hirer xem tiến độ
 */
module.exports.hirerView = async (req, res) => {
  // GẮN SOCKET – GIỐNG CHAT
  progressSocket(res);

  const { projectId } = req.params;
  const user = res.locals.user;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.redirect("/hirer/jobs");
  }

  const project = await Project.findOne({
    _id: projectId,
    hirerId: user._id,
    deleted: false,
  });

  if (!project) {
    req.flash("error", "Không tìm thấy công việc");
    return res.redirect("/hirer/jobs");
  }

  const progressList = await ProjectProgress.find({
    projectId: project._id,
    deleted: false,
  })
    .sort({ createdAt: -1 })
    .populate("freelancerId");

  res.render("client/pages/hirer/progress", {
    pageTitle: "Tiến độ công việc",
    project,
    progressList,
  });
};
