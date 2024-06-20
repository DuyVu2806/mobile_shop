const express = require("express");
const {
  index,
  store,
  update,
  destroy,
  show,
} = require("../../controllers/admin/categoryController");
const { uploadOptions } = require("../../hepler/uploadImage");
const router = express.Router();

router.get("/", index);
router.get("/:id", show);
router.post("/add", uploadOptions.single("image"), store);
router.put("/update/:id", uploadOptions.single("image"), update);
router.delete("/delete/:id", destroy);

module.exports = router;
