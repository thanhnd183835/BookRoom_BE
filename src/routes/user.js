const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
const verifyToken = require("../middlewares/verifyToke");

router.get("/get-by-token", verifyToken, controller.getByToken);
module.exports = router;
