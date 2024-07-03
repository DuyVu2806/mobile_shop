import express from "express";
import { contact, contacts } from "../../controllers/admin/chatController.js";

const router = express.Router();

router.get("/contact/:id", contact);
router.get("/contact", contacts);

export default router;
