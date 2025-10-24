const Project = require("../../models/project.model");
const ProjectCategory = require("../../models/project-category.model");

const projectCategoryHelper = require("../../helpers/project-category");

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
      status: "OPEN",
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

// [GET] /client/projects/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProjectCategory.findOne({
      slug: req.params.slugCategory,
      status: "active",
      deleted: false,
    });

    // lấy tất cả danh mục con
    const listSubCategory = await projectCategoryHelper.getSubCategory(category.id);
    
    const listSubCategoryId = listSubCategory.map(item => item.id);

    const projects = await Project.find({
      project_category_id: { $in: [category.id, ...listSubCategoryId] }, 
      deleted: false,
    }).sort({ position: "desc" });

    res.render("client/pages/projects/index", {
      pageTitle: category.title,
      projects: projects,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại danh mục này!`);
    res.redirect(`/projects`);
  }
};
