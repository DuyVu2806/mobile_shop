import express from "express";
import { verifyToken } from "../../middleware/jwtCus.js";
import {
  index,
  store,
  show,
  update,
  destroy,
} from "../../controllers/customer/addressCustomerController.js";

const router = express.Router();

router.get("/", verifyToken, index);
router.get("/:id", verifyToken, show);
router.post("/add-to-address", verifyToken, store);
router.put("/update-to-address/:id", verifyToken, update);
router.delete("/delete-to-address/:id", verifyToken, destroy);

export default router;
