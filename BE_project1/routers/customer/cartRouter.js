const express = require("express");
const {
  index,
  addToCart,
  update,
  destroy,
  numCart,
  destroyAll,
} = require("../../controllers/customer/cartController");
const { verifyToken } = require("../../middleware/jwtCus");
const router = express.Router();

router.get("/", verifyToken, index);
router.get("/number-cart", verifyToken, numCart);
router.post("/add-to-cart", verifyToken, addToCart);
router.patch("/update-quantity/:id", verifyToken, update);
router.delete("/delete/:id", verifyToken, destroy);
router.delete("/delete-all",verifyToken, destroyAll);
module.exports = router;
