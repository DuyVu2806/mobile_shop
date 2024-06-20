const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/jwtCus");
const { index, store, show } = require("../../controllers/customer/orderController");

router.get("/", verifyToken, index);
router.post("/checkout", verifyToken, store);
router.get("/:code", verifyToken, show);
module.exports = router;
