const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/freelancer.controller");
const requireUser = require("../../middlewares/client/user.middleware");

router.get("/proposals", requireUser.requireFreelancer, controller.myProposals);

// Công việc đang làm
router.get("/jobs", requireUser.requireFreelancer, controller.myJobs);

// Lịch sử công việc
router.get("/jobs/history", requireUser.requireFreelancer, controller.history);

module.exports = router;
