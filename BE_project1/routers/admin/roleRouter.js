const express = require("express");
const { findAll, addRole } = require("../../controllers/admin/roleController");
const { verifyRole } = require("../../middleware/jwtAdmin");
const router = express.Router();

router.get("/", verifyRole,findAll);
router.post("/add-role", addRole);

module.exports = router;
