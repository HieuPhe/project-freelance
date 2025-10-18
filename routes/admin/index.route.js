const systemConfig = require("../../config/system");

const dashboardRoute = require("./dashboard.route");
const projectRoute = require("./project.route");
const projectCategoryRoute = require("./project-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");


module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + "/dashboard", dashboardRoute);

  app.use(PATH_ADMIN + "/projects", projectRoute);

  app.use(PATH_ADMIN + "/projects-category", projectCategoryRoute);

  app.use(PATH_ADMIN + "/roles", roleRoute);

  app.use(PATH_ADMIN + "/accounts", accountRoute);
};
