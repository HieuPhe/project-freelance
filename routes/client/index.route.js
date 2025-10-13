const homeRoute = require("./home.route");
const projectRoute = require("./project.route");

module.exports = (app) => {
  app.use("/", homeRoute);

  app.use("/projects", projectRoute);

};
