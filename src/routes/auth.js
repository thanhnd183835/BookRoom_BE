const express = require("express");
const router = express.Router();
const controller = require("../controller/auth");
const createTableIfNotExists = require("../middlewares/index");

router.post("/register", createTableIfNotExists, controller.register);
router.post("/login", controller.login);
module.exports = router;
