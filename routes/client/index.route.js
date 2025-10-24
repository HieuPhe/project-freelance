const categoryMiddleware = require("../../middlewares/client/category.middleware");

const homeRoute = require("./home.route");
const projectRoute = require("./project.route");

module.exports = (app) => {
  app.use(categoryMiddleware.category);

  app.use("/", homeRoute);

  app.use("/projects", projectRoute);
};
