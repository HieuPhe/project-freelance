const Proposal = require("../../models/proposal.model");

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
    proposals: proposals
  });
};
