const Cart = require("../../models/cart.model");

// [POST] /client/cart/add/projectId
module.exports.addPost = async (req, res) => {
  const projectId = req.params.projectId;
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const existProjectInCart = cart.projects.find(
    (item) => item.project_id == projectId
  );

  if (!existProjectInCart) {
    const objectCart = {
      project_id: projectId,
    };
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { projects: objectCart },
      }
    );

    req.flash("success", "Đã thêm công việc vào mục đề xuất");
  } else {
    req.flash("warning", "Công việc đã được thêm vào đề xuất");
  }

  res.redirect(req.get("referer") || "/");
};
