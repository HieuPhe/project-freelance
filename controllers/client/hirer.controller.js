const Project = require("../../models/project.model");
const Proposal = require("../../models/proposal.model");
const Notification = require("../../models/notification.model");

// [GET] /hirer/projects
// Danh sách công việc của hirer hiện tại
module.exports.myProjects = async (req, res) => {
  const user = res.locals.user;

  const projects = await Project.find({
    hirerId: user._id,
    status: { $in: ["OPEN", "IN_PROGRESS"] },
    deleted: false,
  });

  res.render("client/pages/hirer/projects", {
    pageTitle: "Công việc của tôi",
    projects: projects,
  });
};

// [GET] /hirer/projects/:projectId/proposals
module.exports.viewProposals = async (req, res) => {
  const user = res.locals.user;
  const projectId = req.params.projectId;

  const project = await Project.findOne({
    _id: projectId,
    hirerId: user._id,
    deleted: false,
  });

  if (!project) {
    req.flash("error", "Không tìm thấy công việc!");
    return res.redirect("/hirer/projects");
  }

  const proposals = await Proposal.find({
    "projects.project_id": projectId,
    deleted: false,
  })
    .sort({ createdAt: -1 })
    .populate("freelancerId");

  res.render("client/pages/hirer/proposals", {
    pageTitle: "Đề xuất cho công việc: " + project.title,
    project: project,
    proposals: proposals,
  });
};

// [POST] /hirer/proposals/:proposalId/accept
module.exports.acceptProposal = async (req, res) => {
  const user = res.locals.user;
  const proposalId = req.params.proposalId;

  const proposal = await Proposal.findOne({
    _id: proposalId,
    deleted: false,
  });

  if (!proposal) {
    req.flash("error", "Không tìm thấy đề xuất!");
    return res.redirect("/hirer/projects");
  }

  const projectId = proposal.projects[0].project_id;

  const project = await Project.findOne({
    _id: projectId,
    hirerId: user._id,
    deleted: false,
  });

  if (!project) {
    req.flash("error", "Bạn không có quyền với công việc này!");
    return res.redirect("/hirer/projects");
  }

  proposal.status = "ACCEPTED";
  await proposal.save();

  await Proposal.updateMany(
    {
      _id: { $ne: proposal._id },
      "projects.project_id": projectId,
      deleted: false,
    },
    {
      $set: { status: "REJECTED" },
    }
  );

  project.status = "IN_PROGRESS";
  project.acceptedFreelancerId = proposal.freelancerId;
  await project.save();

  const freelancerId = proposal.freelancerId; // ✅ BẮT BUỘC PHẢI CÓ

  const hirerId = req.user._id;

  // ===============================
  // NOTIFICATION → FREELANCER
  // ===============================
  const notification = await Notification.create({
    userId: freelancerId,
    type: "PROPOSAL_ACCEPTED",
    title: "Đề xuất được chấp nhận",
    content: `Hirer đã chấp nhận đề xuất của bạn`,
    projectId: project._id,
    fromUser: hirerId,
  });

  // SOCKET – GIỐNG PHẦN GỬI PROPOSAL
  if (global._io) {
    global._io.to(`user_${freelancerId}`).emit("NOTIFICATION_NEW", {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      content: notification.content,
      projectId: project._id,
      isRead: false,
      createdAt: notification.createdAt,
    });
  }

  req.flash("success", "Đã chấp nhận đề xuất!");
  return res.redirect("/hirer/projects/" + projectId + "/proposals");
};

// [POST] /hirer/proposals/:proposalId/reject
module.exports.rejectProposal = async (req, res) => {
  const user = res.locals.user;
  const proposalId = req.params.proposalId;

  const proposal = await Proposal.findOne({
    _id: proposalId,
    deleted: false,
  });

  if (!proposal) {
    req.flash("error", "Không tìm thấy đề xuất!");
    return res.redirect("/hirer/projects");
  }

  const projectId = proposal.projects[0].project_id;

  const project = await Project.findOne({
    _id: projectId,
    hirerId: user._id,
    deleted: false,
  });

  if (!project) {
    req.flash("error", "Bạn không có quyền với công việc này!");
    return res.redirect("/hirer/projects");
  }

  proposal.status = "REJECTED";
  await proposal.save();

  const freelancerId = proposal.freelancerId;

  const hirerId = req.user._id;

  const notification = await Notification.create({
    userId: freelancerId,
    type: "PROPOSAL_REJECTED",
    title: "Đề xuất bị từ chối",
    content: `Hirer đã từ chối đề xuất của bạn`,
    projectId: project._id,
    fromUser: hirerId,
  });

  if (global._io) {
    global._io.to(`user_${freelancerId}`).emit("NOTIFICATION_NEW", {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      content: notification.content,
      projectId: project._id,
      isRead: false,
      createdAt: notification.createdAt,
    });
  }

  req.flash("success", "Đã từ chối đề xuất!");
  return res.redirect("/hirer/projects/" + projectId + "/proposals");
};

// [GET] /hirer/projects/create
module.exports.create = async (req, res) => {
  res.render("client/pages/hirer/create", {
    pageTitle: "Đăng công việc mới",
  });
};

// [POST] /hirer/projects/create
module.exports.createPost = async (req, res) => {
  try {
    const user = res.locals.user;

    const title = req.body.title;
    const description = req.body.description;
    const budgetMin = req.body.budgetMin;
    const budgetMax = req.body.budgetMax;
    const deadline = req.body.deadline;

    // Validate cơ bản
    if (!title || !description) {
      req.flash("error", "Vui lòng nhập đầy đủ tên công việc và mô tả!");
      return res.redirect("/hirer/projects/create");
    }

    let min = budgetMin ? Number(budgetMin) : 0;
    let max = budgetMax ? Number(budgetMax) : 0;

    if (Number.isNaN(min)) min = 0;
    if (Number.isNaN(max)) max = 0;

    if (min && max && min > max) {
      req.flash("error", "Ngân sách tối thiểu không được lớn hơn tối đa!");
      return res.redirect("/hirer/projects/create");
    }

    let deadlineDate = null;
    if (deadline) {
      const d = new Date(deadline);
      if (!isNaN(d.getTime())) {
        deadlineDate = d;
      }
    }

    const projectData = {
      title: title,
      description: description,
      hirerId: user._id,
      budget: {
        min: min,
        max: max,
      },
      deadline: deadlineDate,
      status: "OPEN",
      deleted: false,
      // slug: plugin trong model sẽ tự tạo từ title
    };

    await Project.create(projectData);

    req.flash("success", "Đăng công việc mới thành công!");
    return res.redirect("/hirer/projects");
  } catch (error) {
    console.log("createPost error:", error);
    req.flash("error", "Không thể tạo công việc, vui lòng thử lại!");
    return res.redirect("/hirer/projects/create");
  }
};

// [GET] /hirer/jobs
module.exports.myWorkingProjects = async (req, res) => {
  const user = res.locals.user;

  const projects = await Project.find({
    hirerId: user._id,
    status: "IN_PROGRESS",
    deleted: false,
  })
    .sort({ updatedAt: -1 })
    .populate("acceptedFreelancerId");

  res.render("client/pages/hirer/jobs", {
    pageTitle: "Công việc đang thực hiện",
    projects: projects,
  });
};

// [GET] /hirer/jobs/history
module.exports.history = async (req, res) => {
  const user = res.locals.user;

  const projects = await Project.find({
    hirerId: user._id,
    status: "CLOSED",
    deleted: false,
  })
    .sort({ updatedAt: -1 })
    .populate("acceptedFreelancerId"); // ⭐ THIẾU DÒNG NÀY

  res.render("client/pages/hirer/history", {
    pageTitle: "Lịch sử công việc",
    projects,
  });
};

// [POST] /hirer/projects/:projectId/complete
module.exports.completeProject = async (req, res) => {
  try {
    const user = res.locals.user;
    const projectId = req.params.projectId;

    // 1. Tìm project theo id + hirerId
    const project = await Project.findOne({
      _id: projectId,
      hirerId: user._id,
      deleted: false,
    });

    if (!project) {
      console.log("completeProject: project not found or not belong to hirer");
      req.flash("error", "Không tìm thấy công việc!");
      return res.redirect("/hirer/jobs");
    }

    if (project.status !== "IN_PROGRESS") {
      console.log("completeProject: project.status =", project.status);
      req.flash(
        "error",
        "Chỉ những công việc đang thực hiện mới có thể đánh dấu hoàn thành!"
      );
      return res.redirect("/hirer/jobs");
    }

    project.status = "CLOSED";
    await project.save();

    const freelancerId = project.acceptedFreelancerId;

    const hirerId = req.user._id;

    const notification = await Notification.create({
      userId: freelancerId,
      type: "JOB_COMPELETED",
      title: "Công việc đã hoàn thành",
      content: `Hirer đã đánh dấu hoàn thành dự án`,
      projectId: project._id,
      fromUser: hirerId,
    });

    if (global._io) {
      global._io.to(`user_${freelancerId}`).emit("NOTIFICATION_NEW", {
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        projectId: project._id,
        isRead: false,
        createdAt: notification.createdAt,
      });
    }

    req.flash("success", "Đã đánh dấu hoàn thành công việc!");
    return res.redirect("/hirer/jobs");
  } catch (error) {
    console.log("completeProject error:", error);
    req.flash("error", "Không thể hoàn thành công việc, vui lòng thử lại!");
    return res.redirect("/hirer/jobs");
  }
};
