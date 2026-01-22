const express = require("express");
const router = express.Router();

const progressController = require("../../controllers/client/progress.controller");
const requireUser = require("../../middlewares/client/user.middleware");

// Freelancer

// VIEW
router.get(
  "/freelancer/:projectId",
  requireUser.infoUser,
  progressController.freelancerView
);

// CREATE
router.post(
  "/freelancer/:projectId",
  requireUser.infoUser,
  progressController.create
);

// Hirer
router.get(
  "/hirer/:projectId",
  requireUser.infoUser,
  progressController.hirerView
);

module.exports = router;
