import express from "express";
import {
  store,
  index,
  show,
  update,
  destroy,
} from "../../controllers/admin/productController.js";
import { uploadOptions } from "../../hepler/uploadImage.js";

const router = express.Router();

router.get("/", index);
router.get("/:id", show);
router.post("/add", uploadOptions.array("images"), store);
router.put("/update/:id", uploadOptions.array("images"), update);
router.delete("/delete/:id", destroy);

export default router;
