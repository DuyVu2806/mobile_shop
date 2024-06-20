const express = require("express");
const { verifyToken } = require("../../middleware/jwtAdmin");
const { index, show, update } = require("../../controllers/admin/orderController");
const router = express.Router();

router.get("/", verifyToken, index);
router.get("/:order_code", verifyToken, show);
router.post("/update_status/:order_code" ,verifyToken, update)

module.exports = router; 
  