const express = require("express");
const router = express.Router();

const { getAll } = require("../../controllers/admin/adminController");
const {  verifyToken } = require("../../middleware/jwtAdmin");

router.get("/", verifyToken, getAll);

module.exports = router;
