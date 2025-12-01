const ProjectCategory = require("../../models/project-category.model");
const Project = require("../../models/project.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProject: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    project: {
      total: 0,
      OPEN: 0,
      IN_PROGRESS: 0,
      CLOSED: 0,
      CANCELLED: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  // Project

  statistic.project.total = await Project.countDocuments({
    deleted: false,
  });

  statistic.project.OPEN = await Project.countDocuments({
    status: "OPEN",
    deleted: false,
  });

  statistic.project.IN_PROGRESS = await Project.countDocuments({
    status: "IN_PROGRESS",
    deleted: false,
  });
  statistic.project.CLOSED = await Project.countDocuments({
    status: "CLOSED",
    deleted: false,
  });

  statistic.project.CANCELLED = await Project.countDocuments({
    status: "CANCELLED",
    deleted: false,
  });

  // Category

  statistic.categoryProject.total = await ProjectCategory.countDocuments({
    deleted: false,
  });

  statistic.categoryProject.active = await ProjectCategory.countDocuments({
    status: "active",
    deleted: false,
  });

  statistic.categoryProject.inactive = await ProjectCategory.countDocuments({
    status: "inactive",
    deleted: false,
  });
  
  // Account

  statistic.account.total = await Account.countDocuments({
    deleted: false,
  });

  statistic.account.active = await Account.countDocuments({
    status: "active",
    deleted: false,
  });

  statistic.account.inactive = await Account.countDocuments({
    status: "inactive",
    deleted: false,
  });

  // User

  statistic.user.total = await User.countDocuments({
    deleted: false,
  });

  statistic.user.active = await User.countDocuments({
    status: "active",
    deleted: false,
  });

  statistic.user.inactive = await User.countDocuments({
    status: "inactive",
    deleted: false,
  });

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic,
  });
};
