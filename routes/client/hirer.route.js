const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/hirer.controller");
const userMiddleware = require("../../middlewares/client/user.middleware");

// [GET] /hirer/projects  → danh sách job của tôi
router.get("/projects", userMiddleware.requireHirer, controller.myProjects);

// [GET] /hirer/projects/create  → form tạo công việc
router.get("/projects/create", userMiddleware.requireHirer, controller.create);

// [POST] /hirer/projects/create  → xử lý tạo công việc
router.post(
  "/projects/create",
  userMiddleware.requireHirer,
  controller.createPost
);

// [GET] /hirer/projects/:projectId/proposals  → xem đề xuất cho 1 job
router.get(
  "/projects/:projectId/proposals",
  userMiddleware.requireHirer,
  controller.viewProposals
);

// [POST] /hirer/proposals/:proposalId/accept  → chấp nhận 1 đề xuất
router.post(
  "/proposals/:proposalId/accept",
  userMiddleware.requireHirer,
  controller.acceptProposal
);

// [POST] /hirer/proposals/:proposalId/reject  → từ chối 1 đề xuất
router.post(
  "/proposals/:proposalId/reject",
  userMiddleware.requireHirer,
  controller.rejectProposal
);

// [GET] /hirer/jobs  → công việc đang thực hiện
router.get("/jobs", userMiddleware.requireHirer, controller.myWorkingProjects);

// [GET] /hirer/jobs/history  → lịch sử công việc đã hoàn thành
router.get(
  "/jobs/history",
  userMiddleware.requireHirer,
  controller.history
);

// [POST] /hirer/projects/:projectId/complete  → đánh dấu hoàn thành
router.post(
  "/projects/:projectId/complete",
  userMiddleware.requireHirer,
  controller.completeProject
);

module.exports = router;
