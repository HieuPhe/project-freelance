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

  // Validate
  if (isNaN(req.body.budgetMin) || isNaN(req.body.budgetMax)) {
    req.flash("warning", "Ngân sách phải là số!");
    res.redirect(req.get("referer") || "/");
    return;
  }
  if (req.body.budgetMin <= 0 || req.body.budgetMax <= 0) {
    req.flash("warning", "Ngân sách không được nhỏ hơn hoặc bằng 0!");
    res.redirect(req.get("referer") || "/");
    return;
  }
  if (req.body.budgetMin > req.body.budgetMax) {
    req.flash("warning", "Ngân sách tối thiểu không được lớn hơn tối đa!");
    res.redirect(req.get("referer") || "/");
    return;
  }

  if (!req.body.deadline) {
    req.flash("warning", `Vui lòng nhập hạn chào giá!`);
    res.redirect(req.get("referer") || "/");
    return;
  }
  
  const now = new Date();
  const deadline = new Date(req.body.deadline);
  if (deadline.getTime() <= now.getTime()) {
    req.flash("warning", "Hạn chào giá phải lớn hơn thời gian hiện tại!");
    return res.redirect(req.get("referer") || "/");
  }

  next();
};
