const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/client/checkout.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

router.get("/", controller.index);

router.post("/proposal", upload.single("cv"), uploadCloud.upload, controller.proposal);

router.get("/success/:proposalId", controller.success);

module.exports = router;
