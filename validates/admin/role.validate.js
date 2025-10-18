module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("warning", `Vui lòng nhập tiêu đề!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (/[^a-zA-Z0-9À-ỹ\s]/.test(req.body.title)) {
    req.flash("warning", `Tiêu đề không được chứa ký tự đặc biệt!`);
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (!req.body.description) {
    req.flash("warning", `Vui lòng nhập mô tả!`);
    res.redirect(req.get("referer") || "/");
    return;
  }


  next();
};
