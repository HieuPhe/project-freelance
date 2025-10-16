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

// [GET] /admin/projects-category/create

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

// [POST] /admin/projects-category/create

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

// [GET] /admin/projects-category/edit/:id

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProjectCategory.findOne({
      _id: id,
      deleted: false,
    });

    const records = await ProjectCategory.find({
      deleted: false,
    });

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/projects-category/edit", {
      pageTitle: "Chỉnh sửa danh mục công việc",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/projects-category`);
  }
};

// [PATCH] /admin/projects-category/edit/:id

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.position = parseInt(req.body.position);

  await ProjectCategory.updateOne({ _id: id }, req.body);

  res.redirect(req.get("referer") || "/");
};
