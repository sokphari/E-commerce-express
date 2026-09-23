const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/me", authenticate, userController.getCurrentUser);

module.exports = router;
