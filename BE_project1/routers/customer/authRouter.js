const express = require("express");
const router = express.Router();

const {
  login,
  register,
  verifyToken,
} = require("../../controllers/customer/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/verify-token", verifyToken);
module.exports = router;
