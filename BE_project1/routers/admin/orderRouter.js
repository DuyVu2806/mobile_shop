import express from "express";
import { verifyToken } from "../../middleware/jwtAdmin.js";
import { index, show, update } from "../../controllers/admin/orderController.js";

const router = express.Router();

router.get("/", verifyToken, index);
router.get("/:order_code", verifyToken, show);
router.post("/update_status/:order_code", verifyToken, update);

export default router;
