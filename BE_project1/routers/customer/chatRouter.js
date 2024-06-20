const express = require("express");
const { index } = require("../../controllers/customer/chatController");
const { verifyToken } = require("../../middleware/jwtCus");
const router = express.Router();

router.get("/messages", verifyToken, index);
module.exports = router;
