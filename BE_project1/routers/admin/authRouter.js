import express from "express";
import {
  register,
  login,
  verifyToken,
} from "../../controllers/admin/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify-token", verifyToken);

export default router;
