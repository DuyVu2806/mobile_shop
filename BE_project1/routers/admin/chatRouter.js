const express = require("express");
const { contact, contacts } = require("../../controllers/admin/chatController");
const router = express.Router();

router.get("/contact/:id", contact);
router.get("/contact", contacts);

module.exports = router;
