const Project = require("../../models/project.model");
const ProjectCategory = require("../../models/project-category.model");
const Account = require("../../models/account.model.js");

const systemConfig = require("../../config/system.js");

const filterStatusHelper = require("../../helpers/filterStatus");
const paginationHelper = require("../../helpers/pagination");
const searchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/createTree.js");

// [GET] /admin/projects

module.exports.index = async (req, res) => {
  // Bộ lọc
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm
  const countProjects = await Project.countDocuments(find);

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Phân trang
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 5,
    },
    req.query,
    countProjects
  );

  // Sắp xếp
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const projects = await Project.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const project of projects) {
    const user = await Account.findOne({
      _id : project.createdBy.account_id
    });

    if(user) {
      project.accountFullName = user.fullName;
    }
  }

  res.render("admin/pages/projects/index", {
    pageTitle: "Danh sách công việc",
    projects: projects,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/projects/change-multi

module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "OPEN":
      await Project.updateMany({ _id: { $in: ids } }, { status: "OPEN" });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} công việc!`
      );
      break;
    case "IN_PROGRESS":
      await Project.updateMany(
        { _id: { $in: ids } },
        { status: "IN_PROGRESS" }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} công việc!`
      );
      break;
    case "CLOSED":
      await Project.updateMany({ _id: { $in: ids } }, { status: "CLOSED" });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} công việc!`
      );
      break;
    case "CANCELLED":
      await Project.updateMany({ _id: { $in: ids } }, { status: "CANCELLED" });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} công việc!`
      );
      break;
    case "delete-all":
      await Project.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deleteAt: new Date() }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} công việc!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Project.updateOne({ _id: id }, { position: position });

        req.flash("success", `Đổi vị trí thành công ${ids.length} công việc!`);
      }

      break;

    default:
      break;
  }

  res.redirect(req.get("referer") || "/");
};

// [DELETE] /admin/projects/delete/:id

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Project.updateOne(
    { _id: id },
    {
      deleted: true,
      deleteAt: new Date(),
    }
  );

  req.flash("success", `Đã xóa thành công công việc!`);

  res.redirect(req.get("referer") || "/");
};

// [GET] /admin/projects/create

module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const category = await ProjectCategory.find(find);

  const newCategory = createTreeHelper.tree(category);

  res.render("admin/pages/projects/create", {
    pageTitle: "Thêm mới công việc",
    category: newCategory,
  });
};

// [POST] /admin/projects/create

module.exports.createPost = async (req, res) => {
  req.body.budget = {
    min: req.body.budgetMin,
    max: req.body.budgetMax,
  };

  if (req.body.position == "") {
    const countProjects = await Project.countDocuments();
    req.body.position = countProjects + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id,
  };

  // Lưu vào database
  const project = new Project(req.body);
  await project.save();

  res.redirect(`${systemConfig.prefixAdmin}/projects`);
};

// [GET] /admin/projects/edit/:id

module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const project = await Project.findOne(find);

    const category = await ProjectCategory.find({
      deleted: false,
    });

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/projects/edit", {
      pageTitle: "Chỉnh sửa công việc",
      project: project,
      category: newCategory,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại công việc này!`);
    res.redirect(`${systemConfig.prefixAdmin}/projects`);
  }
};

// [PATCH] /admin/projects/editPatch

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.budget = {
    min: parseInt(req.body.budgetMin),
    max: parseInt(req.body.budgetMax),
  };
  req.body.position = parseInt(req.body.position);
  // Phần ảnh
  // if (req.file) {
  //   req.body.thumbnail = `uploads/${req.file.filename}`;
  // }

  // Lưu vào database
  try {
    await Project.updateOne({ _id: id }, req.body);
    req.flash("success", `Cập nhật thành công!`);
  } catch (error) {
    req.flash("error", `Cập nhật thất bại!`);
  }

  res.redirect(req.get("referer") || "/");
};

// [GET] /admin/projects/detail/:id

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const project = await Project.findOne(find);

    const category = await ProjectCategory.find({
      deleted: false,
    });

    const found = category.find(
      (item) => item.id == project.project_category_id
    );

    const name = found.title;

    res.render("admin/pages/projects/detail", {
      pageTitle: project.title,
      project: project,
      name: name,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại công việc này!`);
    res.redirect(`${systemConfig.prefixAdmin}/projects`);
  }
};
