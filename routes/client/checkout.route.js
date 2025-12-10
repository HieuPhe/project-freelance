const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/client/checkout.controller");
const uploadCloud = require("../../middlewares/client/uploadCloud.middlewares");
const requireUser = require("../../middlewares/client/user.middleware");

router.get("/", requireUser.requireFreelancer, controller.index);

router.post("/proposal",requireUser.requireFreelancer , upload.single("cv"), uploadCloud.upload, controller.proposal);

router.get("/success/:proposalId",requireUser.requireFreelancer , controller.success);

module.exports = router;
