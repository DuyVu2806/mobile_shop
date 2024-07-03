import express from "express";
import {
  index,
  addToCart,
  update,
  destroy,
  numCart,
  destroyAll,
} from "../../controllers/customer/cartController.js";
import { verifyToken } from "../../middleware/jwtCus.js";

const router = express.Router();

router.get("/", verifyToken, index);
router.get("/number-cart", verifyToken, numCart);
router.post("/add-to-cart", verifyToken, addToCart);
router.patch("/update-quantity/:id", verifyToken, update);
router.delete("/delete/:id", verifyToken, destroy);
router.delete("/delete-all", verifyToken, destroyAll);

export default router;
