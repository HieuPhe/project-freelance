const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/notification.controller");

const authMiddleware = require("../../middlewares/client/auth.middlewares");

router.get("/", controller.index);

router.post(
  "/notifications/:id/read",
  authMiddleware.requireAuth,
  controller.markAsRead
);

router.post("/read-all", authMiddleware.requireAuth, controller.markAllAsRead);


module.exports = router;
