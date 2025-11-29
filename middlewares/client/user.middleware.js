const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      tokenUser : req.cookies.tokenUser,
      deleted: false,
      status: "active"
    }).select("-password");

    if(user) {
      res.locals.user = user;
    }
  }
  next();
};

module.exports.requireHirer = async (req, res, next) => {
  try {
    const tokenUser = req.cookies.tokenUser;

    // Chưa đăng nhập
    if (!tokenUser) {
      req.flash("error", "Bạn cần đăng nhập để thực hiện chức năng này!");
      return res.redirect("/user/login");
    }

    const user = await User.findOne({
      tokenUser: tokenUser,
      deleted: false
    });

    // Không tìm thấy user
    if (!user) {
      req.flash("error", "Tài khoản không tồn tại hoặc đã bị xóa!");
      return res.redirect("/user/login");
    }

    // Tài khoản bị khóa
    if (user.status === "inactive") {
      req.flash("error", "Tài khoản của bạn đã bị khóa!");
      return res.redirect(req.get("referer") || "/");
    }

    // Không phải HIRER thì chặn
    if (user.roleUser !== "hirer") {
      req.flash(
        "error",
        "Chỉ nhà tuyển dụng (hirer) mới có quyền tạo mới công việc!"
      );
      return res.redirect(req.get("referer") || "/");
    }

    // Lưu user xuống locals để view dùng (if(user) trong pug)
    res.locals.user = user;
    req.user = user;

    next();
  } catch (error) {
    console.log("requireHirer error:", error);
    req.flash("error", "Đã xảy ra lỗi, vui lòng thử lại sau!");
    return res.redirect(req.get("referer") || "/");
  }
};
