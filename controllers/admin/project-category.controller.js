const ProjectCategory = require("../../models/project-category.model");

const systemConfig = require("../../config/system.js");

// [GET] /admin/projects-category

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProjectCategory.find(find);

  res.render("admin/pages/projects-category/index", {
    pageTitle: "Danh mục công việc",
    records: records
  });
};

// [GET] /admin/projects-category

module.exports.create = async (req, res) => {
  res.render("admin/pages/projects-category/create", {
    pageTitle: "Tạo danh mục công việc",
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
