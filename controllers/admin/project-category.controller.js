const ProjectCategory = require("../../models/project-category.model");

const systemConfig = require("../../config/system.js");

const createTreeHelper = require("../../helpers/createTree.js");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/projects-category

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  // Tìm kiếm
  const countCategory = await ProjectCategory.countDocuments(find);

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Phân trang
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 3,
    },
    req.query,
    countCategory
  );

  // Sắp xếp
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "asc";
  }

  const records = await ProjectCategory.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/projects-category/index", {
    pageTitle: "Danh mục công việc",
    records: newRecords,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
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

// [GET] /admin/projects-category/detail/:id

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const category = await ProjectCategory.findOne(find);

    const records = await ProjectCategory.find({
      deleted: false,
    });
    let name = ""; 

    const found = records.find((item) => item.id == category.parent_id);

    if (found) {
      name = found.title; 
    } else {
      name = ""; 
    }

    res.render("admin/pages/projects-category/detail", {
      pageTitle: category.title,
      category: category,
      name: name,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại danh mục này!`);
    res.redirect(`${systemConfig.prefixAdmin}/projects-category`);
  }
};

// [DELETE] /admin/projects-category/delete/:id

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await ProjectCategory.updateOne(
    { _id: id },
    {
      deleted: true,
      deleteAt: new Date(),
    }
  );

  req.flash("success", `Đã xóa thành công danh mục!`);

  res.redirect(req.get("referer") || "/");
};
