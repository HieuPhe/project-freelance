const express = require("express");

// const multer = require("multer");
const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/project.controller");
const validate = require("../../validates/admin/project.validate");

router.get("/", controller.index);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post("/create", validate.createPost, controller.createPost);
// upload.single("thumbnail") thêm phần này vào router controller sử dụng

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", validate.createPost, controller.editPatch);
// upload.single("thumbnail") thêm phần này vào router controller sử dụng

router.get("/detail/:id", controller.detail);

module.exports = router;
