const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/freelancer.controller");
const requireUser = require("../../middlewares/client/user.middleware");


router.get("/proposals", requireUser.requireFreelancer, controller.myProposals);

module.exports = router;
