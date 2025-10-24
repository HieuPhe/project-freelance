const Project = require("../../models/project.model");

// [GET] /client/home
module.exports.index = async (req, res) => {
  // Lấy ra cv nổi bật
  const projectsFeatured = await Project.find({
    featured: "1",
    deleted: false,
    status: "OPEN",
  }).limit(4);

  // Lấy ra cv mới nhất
  const projectsNew = await Project.find({
    deleted: false,
    status: "OPEN"
  }).sort({ position: "desc" }).limit(4);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    projectsFeatured: projectsFeatured,
    projectsNew: projectsNew
  });
};
