const express = require("express");
const { verifyToken } = require("../../middleware/jwtCus");
const {
  index,
  store,
  show,
  update,
  destroy,
} = require("../../controllers/customer/addressCustomerController");
const router = express.Router();

router.get("/", verifyToken, index);
router.get("/:id", verifyToken, show);
router.post("/add-to-address", verifyToken, store);
router.put("/update-to-address/:id", verifyToken, update);
router.delete("/delete-to-address/:id", verifyToken, destroy);

module.exports = router;
