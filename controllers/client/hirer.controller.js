const Project = require("../../models/project.model");
const Proposal = require("../../models/proposal.model");

// [GET] /hirer/projects
// Danh sách công việc của hirer hiện tại
module.exports.myProjects = async (req, res) => {
  const user = res.locals.user;

  const projects = await Project.find({
    hirerId: user._id,
    deleted: false,
  }).sort({ createdAt: -1 });

  res.render("client/pages/hirer/projects", {
    pageTitle: "Công việc của tôi",
    projects: projects,
  });
};

// [GET] /hirer/projects/:projectId/proposals
// Xem danh sách đề xuất của 1 công việc
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
// Hirer chấp nhận 1 đề xuất
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

  // Đánh dấu đề xuất được chấp nhận
  proposal.status = "ACCEPTED";
  await proposal.save();

  // Các đề xuất khác cùng project → REJECTED
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

  // Cập nhật project
  project.status = "IN_PROGRESS";
  project.acceptedFreelancerId = proposal.freelancerId;
  await project.save();

  req.flash("success", "Đã chấp nhận đề xuất!");
  return res.redirect("/hirer/projects/" + projectId + "/proposals");
};

// [POST] /hirer/proposals/:proposalId/reject
// Hirer từ chối 1 đề xuất
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

  req.flash("success", "Đã từ chối đề xuất!");
  return res.redirect("/hirer/projects/" + projectId + "/proposals");
};

// [GET] /hirer/projects/create
// Form đăng công việc mới
module.exports.create = async (req, res) => {
  res.render("client/pages/hirer/create", {
    pageTitle: "Đăng công việc mới",
  });
};

// [POST] /hirer/projects/create
// Xử lý đăng công việc mới
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
