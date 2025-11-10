const Cart = require("../../models/cart.model");
const Project = require("../../models/project.model");
const Proposal = require("../../models/proposal.model");

// [GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart.projects.length > 0) {
    for (const item of cart.projects) {
      const projectId = item.project_id;
      const projectInfo = await Project.findOne({
        _id: projectId,
      }).select("title budget slug deadline");

      item.projectInfo = projectInfo;
    }
  }

  res.render("client/pages/checkout/index", {
    pageTitle: "Đề xuất",
    cartDetail: cart,
  });
};

// [POST] /client/checkout/proposal
module.exports.proposal = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const projects = [];

  for (const project of cart.projects) {
    const objectProject = {
      project_id: project.project_id,
      budget: {
        min: 0,
        max: 0,
      },
      deadline: 0,
    };

    const projectInfo = await Project.findOne({
      _id: project.project_id,
    }).select("budget deadline");

    objectProject.budget = projectInfo.budget;
    objectProject.deadline = projectInfo.deadline;

    projects.push(objectProject);
  }

  const proposalInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    projects: projects,
  };

  const proposal = new Proposal(proposalInfo);
  proposal.save();

  // Cần sửa lại
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      projects: [],
    }
  );

  res.redirect(`/checkout/success/${proposal.id}`);
};

// [GET] /client/checkout/success/:proposalId
module.exports.success = async (req, res) => {
  const proposal = await Proposal.findOne({
    _id: req.params.proposalId,
  });

  for (const project of proposal.projects) {
    const projectInfo = await Project.findOne({
      _id: project.project_id,
    });

    project.projectInfo = projectInfo;
  }

  res.render("client/pages/checkout/success", {
    pageTitle: "Gửi đề xuất thành công",
    proposal: proposal
  });
};
