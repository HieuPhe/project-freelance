const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/notification.controller");

router.get("/", controller.index);

router.post(
  "/notifications/:id/read",
  controller.markAsRead
);

router.post("/read-all", controller.markAllAsRead);


module.exports = router;
