const ProjectCategory = require("../../models/project-category.model");

const systemConfig = require("../../config/system.js");

const createTreeHelper = require("../../helpers/createTree.js");

// [GET] /admin/projects-category

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProjectCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/projects-category/index", {
    pageTitle: "Danh mục công việc",
    records: newRecords,
  });
};

// [GET] /admin/projects-category

module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProjectCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/projects-category/create", {
    pageTitle: "Tạo danh mục công việc",
    records: newRecords,
  });
};

// [POST] /admin/projects-category

module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProjectCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // Lưu vào database
  const record = new ProjectCategory(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/projects-category`);
};
