const Cart = require("../../models/cart.model");
const Project = require("../../models/project.model");
const Proposal = require("../../models/proposal.model");
const User = require("../../models/user.model");

// [GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart && cart.projects.length > 0) {
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
  try {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    // Lấy user hiện tại (freelancer) từ token
    const tokenUser = req.cookies.tokenUser;

    const user = await User.findOne({
      tokenUser: tokenUser,
      deleted: false,
      status: "active",
    });

    if (!user) {
      req.flash("error", "Bạn cần đăng nhập để gửi đề xuất!");
      return res.redirect("/user/login");
    }

    const cart = await Cart.findOne({
      _id: cartId,
    });

    if (!cart || !cart.projects || cart.projects.length === 0) {
      req.flash("error", "Giỏ công việc đang trống!");
      return res.redirect("/cart");
    }

    const projects = [];

    for (const project of cart.projects) {
      const objectProject = {
        project_id: project.project_id,
        budget: {
          min: 0,
          max: 0,
        },
        deadline: null,
      };

      const projectInfo = await Project.findOne({
        _id: project.project_id,
      }).select("budget deadline");

      if (projectInfo) {
        objectProject.budget = projectInfo.budget || { min: 0, max: 0 };
        objectProject.deadline = projectInfo.deadline || null;
      }

      projects.push(objectProject);
    }

    const proposalInfo = {
      cart_id: cartId,
      freelancerId: user._id, 
      userInfo: userInfo,
      projects: projects,
      status: "SUBMITTED",
      deleted: false,
    };

    const proposal = new Proposal(proposalInfo);
    await proposal.save();

    // Xóa giỏ đã gửi đề xuất
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        projects: [],
      }
    );

    res.redirect(`/checkout/success/${proposal.id}`);
  } catch (error) {
    console.log("checkout proposal error:", error);
    req.flash("error", "Không thể gửi đề xuất, vui lòng thử lại!");
    return res.redirect("/cart");
  }
};

// [GET] /client/checkout/success/:proposalId
module.exports.success = async (req, res) => {
  const proposal = await Proposal.findOne({
    _id: req.params.proposalId,
  });

  if (proposal && proposal.projects.length > 0) {
    for (const project of proposal.projects) {
      const projectInfo = await Project.findOne({
        _id: project.project_id,
      });

      project.projectInfo = projectInfo;
    }
  }

  res.render("client/pages/checkout/success", {
    pageTitle: "Gửi đề xuất thành công",
    proposal: proposal,
  });
};
