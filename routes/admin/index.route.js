const systemConfig = require("../../config/system");

const dashboardRoute = require("./dashboard.route");
const projectRoute = require("./project.route");
const projectCategoryRoute = require("./project-category.route");


module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + "/dashboard", dashboardRoute);

  app.use(PATH_ADMIN + "/projects", projectRoute);

  app.use(PATH_ADMIN + "/projects-category", projectCategoryRoute);
};
