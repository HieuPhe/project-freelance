const Role = require("../../models/role.model");

const systemConfig = require("../../config/system.js");
const paginationHelper = require("../../helpers/pagination");
const searchHelper = require("../../helpers/search");

// [GET] /admin/roles/index
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  // Tìm kiếm
  const countRoles = await Role.countDocuments(find);

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
    countRoles
  );

  // Sắp xếp
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "asc";
  }

  const records = await Role.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    let find = {
      _id: id,
      deleted: false,
    };

    const data = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      pageTitle: "Sửa nhóm quyền",
      data: data,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    req.flash("success", `Cập nhật thành công!`);
  } catch (error) {
    req.flash("error", `Cập nhật thất bại!`);
  }

  res.redirect(req.get("referer") || "/");
};

// [GET] /admin/roles/detail/:id

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const data = await Role.findOne(find);

    res.render("admin/pages/roles/detail", {
      pageTitle: data.title,
      data: data,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại nhóm quyền này!`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [DELETE] /admin/roles/delete/:id

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      deleteAt: new Date(),
    }
  );

  req.flash("success", `Đã xóa thành công nhóm quyền!`);

  res.redirect(req.get("referer") || "/");
};

// [GET] /admin/roles/permissions

module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records,
  });
};

// [PATCH] /admin/roles/permissions

module.exports.permissionsPatch = async (req, res) => {
  try {
    // Chuyển string về thành mảng
    const permissions = JSON.parse(req.body.permissions);

    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }

    req.flash("success", "Cập nhật phân quyền thành công");
  } catch (error) {
    req.flash("error", "Cập nhật phân quyền thất bại");
  }

  res.redirect(req.get("referer") || "/");
};
