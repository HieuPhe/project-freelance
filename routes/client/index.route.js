const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");

const homeRoute = require("./home.route");
const projectRoute = require("./project.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  
  app.use(cartMiddleware.cartId);

  app.use("/", homeRoute);

  app.use("/projects", projectRoute);

  app.use("/search", searchRoute);

  app.use("/cart", cartRoute);

  app.use("/checkout", checkoutRoute);
};
