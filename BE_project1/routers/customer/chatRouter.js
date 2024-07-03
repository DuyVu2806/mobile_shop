import express from "express";
import { index } from "../../controllers/customer/chatController.js";
import { verifyToken } from "../../middleware/jwtCus.js";

const router = express.Router();

router.get("/messages", verifyToken, index);

export default router;
