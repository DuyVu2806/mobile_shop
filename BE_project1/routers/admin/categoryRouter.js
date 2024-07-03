import express from "express";
import { index, store, update, destroy, show } from "../../controllers/admin/categoryController.js";
import { uploadOptions } from "../../hepler/uploadImage.js";

const router = express.Router();

router.get("/", index);
router.get("/:id", show);
router.post("/add", uploadOptions.single("image"), store);
router.put("/update/:id", uploadOptions.single("image"), update);
router.delete("/delete/:id", destroy);

export default router;

