const Project = require("../../models/project.model");

// [GET] /client/projects
module.exports.index = async (req, res) => {
  const projects = await Project.find({
    status: "OPEN",
    deleted: false,
  }).sort({ position: "desc" });

  res.render("client/pages/projects/index", {
    pageTitle: "Danh sách công việc",
    projects: projects,
  });
};

// [GET] /client/projects/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "OPEN"
    };

    const project = await Project.findOne(find);

    res.render("client/pages/projects/detail", {
      pageTitle: project.title,
      project: project,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại công việc này!`);
    res.redirect(`/projects`);
  }
};
