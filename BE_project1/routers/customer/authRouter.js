import express from "express";
import { login, register, verifyToken } from "../../controllers/customer/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify-token", verifyToken);

export default router;
