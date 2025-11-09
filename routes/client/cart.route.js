const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");

router.get("/", controller.index);

router.post("/add/:projectId", controller.addPost);

router.get("/delete/:projectId", controller.delete);


module.exports = router;