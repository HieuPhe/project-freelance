const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/client/checkout.controller");
const requireUser = require("../../middlewares/client/user.middleware");

router.get("/", requireUser.requireFreelancer, controller.index);

router.post("/proposal",requireUser.requireFreelancer , controller.proposal);

router.get("/success/:proposalId",requireUser.requireFreelancer , controller.success);

module.exports = router;
