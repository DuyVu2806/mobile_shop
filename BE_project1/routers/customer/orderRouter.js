import express from "express";
import { verifyToken } from "../../middleware/jwtCus.js";
import {
  index,
  store,
  show,
} from "../../controllers/customer/orderController.js";

const router = express.Router();

router.get("/", verifyToken, index);
router.post("/checkout", verifyToken, store);
router.get("/:code", verifyToken, show);

export default router;
