const Project = require("../../models/project.model");
const ProjectCategory = require("../../models/project-category.model");

const projectCategoryHelper = require("../../helpers/project-category");
const paginationHelper = require("../../helpers/pagination");

// [GET] /client/projects
module.exports.index = async (req, res) => {
  // Phân trang
  const countProjects = await Project.countDocuments({ status: "OPEN" });

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 6,
    },
    req.query,
    countProjects
  );

  const projects = await Project.find({
    status: "OPEN",
    deleted: false,
  })
    .sort({ position: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  const category = await ProjectCategory.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  res.render("client/pages/projects/index", {
    pageTitle: "Danh sách công việc",
    projects: projects,
    pagination: objectPagination,
    category: category,
  });
};

// [GET] /client/projects/:slugProject
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProject,
      status: "OPEN",
    };

    const project = await Project.findOne(find);

    if (project.project_category_id) {
      const category = await ProjectCategory.findOne({
        _id: project.project_category_id,
        status: "active",
        deleted: false,
      });

      project.category = category;
    }

    const projectsNew = await Project.find({
      deleted: false,
      status: "OPEN",
    })
      .sort({ position: "desc" })
      .limit(3)

    res.render("client/pages/projects/detail", {
      pageTitle: project.title,
      project: project,
      projectsNew: projectsNew,
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

    const countProjects = await Project.countDocuments({ status: "OPEN" });
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItems: 6,
      },
      req.query,
      countProjects
    );

    // lấy tất cả danh mục con
    const listSubCategory = await projectCategoryHelper.getSubCategory(
      category.id
    );

    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const projects = await Project.find({
      project_category_id: { $in: [category.id, ...listSubCategoryId] },
      deleted: false,
    })
      .sort({ position: "desc" })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    res.render("client/pages/projects/index", {
      pageTitle: category.title,
      projects: projects,
      pagination: objectPagination,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại danh mục này!`);
    res.redirect(`/projects`);
  }
};
