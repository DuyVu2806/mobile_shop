const express = require("express");
const { contact } = require("../../controllers/admin/chatController");
const router = express.Router();

router.get("/:id", contact);

module.exports = router;
