const Cart = require("../../models/cart.model");
const Project = require("../../models/project.model");

// [GET] /client/cart/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart.projects.length > 0) {
    for (const item of cart.projects) {
      const projectId = item.project_id;
      const projectInfo = await Project.findOne({
        _id: projectId,
      }).select("title budget slug deadline");

      item.projectInfo = projectInfo;
    }
  }

  res.render("client/pages/cart/index", {
    pageTitle: "Mục đề xuất",
    cartDetail: cart,
  });
};

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

// [GET] /client/cart/delete/projectId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const projectId = req.params.projectId;

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { projects: { project_id: projectId } },
    }
  );

  req.flash("success", "Đã xóa công việc khỏi mục đề xuất");

  res.redirect(req.get("referer") || "/");
};

