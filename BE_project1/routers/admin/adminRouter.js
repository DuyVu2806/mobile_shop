import express from "express";
const router = express.Router();

import { getAll } from "../../controllers/admin/adminController";
import { verifyToken } from "../../middleware/jwtAdmin";

router.get("/", verifyToken, getAll);

export default router;
