const systemConfig = require("../../config/system");

const authMiddleware = require("../../middlewares/admin/auth.middlewares");

const dashboardRoute = require("./dashboard.route");
const projectRoute = require("./project.route");
const projectCategoryRoute = require("./project-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoute
  );

  app.use(
  PATH_ADMIN + "/projects",
  authMiddleware.requireAuth,
  projectRoute
  );

  app.use(
    PATH_ADMIN + "/projects-category",
    authMiddleware.requireAuth,
    projectCategoryRoute
  );

  app.use(
  PATH_ADMIN + "/roles", 
  authMiddleware.requireAuth, 
  roleRoute
  );

  app.use(
  PATH_ADMIN + "/accounts", 
  authMiddleware.requireAuth, 
  accountRoute 
  );

  app.use(PATH_ADMIN + "/auth", authRoute);
};
