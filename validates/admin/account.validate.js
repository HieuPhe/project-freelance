module.exports.createPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("warning", `Vui lòng nhập tên!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (/[^a-zA-Z0-9À-ỹ\s]/.test(req.body.fullName)) {
    req.flash("warning", `Tên không được chứa ký tự đặc biệt!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (!req.body.email) {
    req.flash("warning", `Vui lòng nhập email!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (!req.body.password) {
    req.flash("warning", `Vui lòng nhập mật khẩu!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (!req.body.phone) {
    req.flash("warning", `Vui lòng nhập số điện thoại!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (!/^\d+$/.test(req.body.phone)) {
    req.flash("warning", `Số điện thoại chỉ được chứa các chữ số!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  next();
};

module.exports.editPatch = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("warning", `Vui lòng nhập tiêu đề!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (/[^a-zA-Z0-9À-ỹ\s]/.test(req.body.fullName)) {
    req.flash("warning", `Tiêu đề không được chứa ký tự đặc biệt!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (!req.body.email) {
    req.flash("warning", `Vui lòng nhập mô tả!`);
    res.redirect(req.get("referer") || "/");
    return;
  }


  if (!req.body.phone) {
    req.flash("warning", `Vui lòng nhập điện thoại!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (!/^\d+$/.test(req.body.phone)) {
    req.flash("warning", `Số điện thoại chỉ được chứa các chữ số!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  next();
};
