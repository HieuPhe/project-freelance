const md5 = require("md5");

const User = require("../../models/user.model");

const systemConfig = require("../../config/system.js");

// [GET] /admin/users
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await User.find(find).select("-password -token");

  res.render("admin/pages/users/index", {
    pageTitle: "Danh sách người dùng",
    records: records,
  });
};

// [GET] /admin/users/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await User.find(find);


  res.render("admin/pages/users/create", {
    pageTitle: "Tạo mới tài khoản",
    records: records
  });
};

// [POST] /admin/users/createPost
module.exports.createPost = async (req, res) => {
  const emailExist = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect(req.get("referer") || "/");
  } else {
    req.body.password = md5(req.body.password);
    const record = new User(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
};

// [GET] /admin/accounts/edit
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await User.findOne(find);

    res.render("admin/pages/users/edit", {
      pageTitle: "Chỉnh sửa người dùng",
      data: data,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
};

// [PATCH] /admin/accounts/editPatch
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await User.findOne({
    _id: { $ne: id},
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("warning", `Email ${req.body.email} đã tồn tại`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await User.updateOne({ _id: id }, req.body);

    req.flash("success", `Cập nhật tài khoản thành công`);
  }

  res.redirect(req.get("referer") || "/");
};
