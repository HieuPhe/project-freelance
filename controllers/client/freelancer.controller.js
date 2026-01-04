const Proposal = require("../../models/proposal.model");
const Project = require("../../models/project.model");
const Notification = require("../../models/notification.model");


// [GET] /freelancer/proposals
module.exports.myProposals = async (req, res) => {
  const user = res.locals.user;

  const proposals = await Proposal.find({
    freelancerId: user._id,
    deleted: false,
  })
    .sort({ createdAt: -1 })
    .populate("projects.project_id");

  res.render("client/pages/freelancer/proposals", {
    pageTitle: "Đề xuất của tôi",
    proposals,
  });
};

// [GET] /freelancer/proposals/delete/projectId
module.exports.delete = async (req, res) => {
  const proposalId = await Proposal.findById({
    freelancerId: user._id,
    deleted: false,
    status: "SUBMITTED",
  })
    .sort({ createdAt: -1 })
    .populate("projects.project_id");

  const projectId = await Project.findById({
    freelancerId: user._id,
    deleted: false,
  })
    .sort({ createdAt: -1 })
    .populate("projects.project_id");

  await Proposal.updateOne(
    {
      _id: proposalId,
    },
    {
      $pull: { projects: { project_id: projectId } },
    }
  );

  req.flash("success", "Đã xóa đề xuất thành công");

  res.redirect("/freelancer/proposals");
};

// [GET] /freelancer/jobs
module.exports.myJobs = async (req, res) => {
  const user = res.locals.user;

  const proposals = await Proposal.find({
    freelancerId: user._id,
    status: "ACCEPTED",
    deleted: false,
  }).populate("projects.project_id");

  const jobs = proposals
    .map((p) => p.projects[0]?.project_id)
    .filter((project) => {
      return project && project.status === "IN_PROGRESS";
    });

  res.render("client/pages/freelancer/jobs", {
    pageTitle: "Công việc đang làm",
    jobs,
  });
};

// [GET] /freelancer/jobs/history
module.exports.history = async (req, res) => {
  const user = res.locals.user;

  const proposals = await Proposal.find({
    freelancerId: user._id,
    status: "ACCEPTED",
    deleted: false,
  }).populate("projects.project_id");

  const jobs = proposals
    .map((p) => p.projects[0]?.project_id)
    .filter((project) => {
      return project && project.status === "CLOSED";
    });

  res.render("client/pages/freelancer/history", {
    pageTitle: "Lịch sử công việc",
    jobs,
  });
};
