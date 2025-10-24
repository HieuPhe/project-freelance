const ProjectCategory = require("../../models/project-category.model");

const createTreeHelper = require("../../helpers/createTree.js");

module.exports.category = async (req, res, next) => {
  const projectCategory = await ProjectCategory.find({
    deleted: false,
  });

  const newProjectCategory = createTreeHelper.tree(projectCategory);

  res.locals.layoutProjectCategory = newProjectCategory;
  
  next();
};
