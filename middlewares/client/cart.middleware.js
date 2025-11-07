const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    // tao gio hang
    const cart = new Cart();
    await cart.save();

    const expiresCookie = 365 * 24 * 60 * 60 * 1000;

    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookie),
    });
  } else {
    // lay ra thoi
    const cart = await Cart.findOne({
      _id: req.cookies.cartId,
    });

    // const totalProject = cart.projects.reduce((sum, item) => sum + item, 0);

    cart.totalProject = cart.projects.length;
    
    res.locals.miniCart = cart;
    
  }

  next();
};
