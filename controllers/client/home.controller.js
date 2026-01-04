const Project = require("../../models/project.model");
const ProjectCategory = require("../../models/project-category.model");

const paginationHelper = require("../../helpers/pagination-2");

// [GET] /client/home
module.exports.index = async (req, res) => {

  const countFeatured = await Project.countDocuments({
    featured: "1",
    deleted: false,
    status: "OPEN",
  });

  let paginationFeatured = paginationHelper(
    {
      currentPage: 1,
      limitItems: 3,
    },
    req.query,
    countFeatured,
    "pageFeatured"
  );

  // Lấy ra cv nổi bật

  const projectsFeatured = await Project.find({
    featured: "1",
    deleted: false,
    status: "OPEN",
  })
    .sort({ position: "desc" })
    .limit(paginationFeatured.limitItems)
    .skip(paginationFeatured.skip);

  const countNew = await Project.countDocuments({
    deleted: false,
    status: "OPEN",
  });

  let paginationNew = paginationHelper(
    {
      currentPage: 1,
      limitItems: 3,
    },
    req.query,
    countNew,
    "pageNew"
  );

  // Lấy ra cv mới nhất
  const projectsNew = await Project.find({
    deleted: false,
    status: "OPEN",
  })
    .sort({ position: "desc" })
    .limit(paginationNew.limitItems)
    .skip(paginationNew.skip);

  const category = await ProjectCategory.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    projectsFeatured: projectsFeatured,
    projectsNew: projectsNew,
    paginationFeatured: paginationFeatured,
    paginationNew: paginationNew,
    query: req.query,
    category: category,
  });
};
