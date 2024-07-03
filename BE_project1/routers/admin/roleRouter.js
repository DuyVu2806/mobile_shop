import express from "express";
import { findAll, addRole } from "../../controllers/admin/roleController.js";
import { verifyRole } from "../../middleware/jwtAdmin.js";

const router = express.Router();

router.get("/", verifyRole, findAll);
router.post("/add-role", addRole);

export default router;
