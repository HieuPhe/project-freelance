const Project = require("../../models/project.model");
const ProjectProgress = require("../../models/project-progress.model");

/**
 * Freelancer xem + cập nhật tiến độ
 */
module.exports.freelancerView = async (req, res) => {
  const { projectId } = req.params;

  // 2. Kiểm tra quyền freelancer
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

  // 3. Lấy lịch sử tiến độ
  const progressList = await ProjectProgress.find({
    project: projectId,
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

  // 2. Kiểm tra quyền + trạng thái
  const project = await Project.findOne({
    _id: projectId,
    freelancerId: user._id,
    status: "in_progress",
    deleted: false,
  });

  if (!project) {
    req.flash("error", "Không thể cập nhật tiến độ cho công việc này");
    return res.redirect("/freelancer/jobs");
  }

  // 3. Khóa khi đã hoàn thành
  if (project.progressPercent >= 100) {
    req.flash("info", "Công việc đã hoàn thành");
    return res.redirect(`/progress/freelancer/${projectId}`);
  }

  // 4. Tạo tiến độ
  await ProjectProgress.create({
    project: projectId,
    freelancerId: user._id,
    content,
    percent,
  });

  // 5. Đồng bộ % project
  await Project.findByIdAndUpdate(projectId, {
    progressPercent: percent,
  });

  req.flash("success", "Đã cập nhật tiến độ");
  return res.redirect(`/progress/freelancer/${projectId}`);
};

/**
 * Hirer xem tiến độ
 */
module.exports.hirerView = async (req, res) => {
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
    project: projectId,
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
