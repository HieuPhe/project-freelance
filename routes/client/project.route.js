const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/project.controller");

router.get("/", controller.index);

router.get("/:slugCategory", controller.category);

router.get("/detail/:slugProject", controller.detail);


module.exports = router;