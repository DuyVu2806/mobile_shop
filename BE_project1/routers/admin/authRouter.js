const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyToken,
} = require("../../controllers/admin/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/verify-token", verifyToken);

module.exports = router;
