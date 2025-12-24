const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const infoUserMiddleware = require("../../middlewares/client/user.middleware");
const settingGeneralMiddleware = require("../../middlewares/client/setting.middleware");
const authMiddleware = require("../../middlewares/client/auth.middlewares");


const homeRoute = require("./home.route");
const projectRoute = require("./project.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const userRoute = require("./user.route");
const freelancerRoute  = require("./freelancer.route");
const hirerRoute  = require("./hirer.route");
const chatRoute  = require("./chat.route");


module.exports = (app) => {
  app.use(categoryMiddleware.category);
  
  app.use(cartMiddleware.cartId);
  
  app.use(infoUserMiddleware.infoUser);

  app.use(settingGeneralMiddleware.settingGeneral);

  app.use("/", homeRoute);

  app.use("/projects", projectRoute);

  app.use("/search", searchRoute);

  app.use("/cart", cartRoute);

  app.use("/checkout", checkoutRoute);

  app.use("/user", userRoute);

  app.use("/freelancer", freelancerRoute);
  
  app.use("/hirer", hirerRoute);

  app.use("/chat",authMiddleware.requireAuth, chatRoute);


};