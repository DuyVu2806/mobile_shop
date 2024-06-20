const express = require("express");
const {
  store,
  index,
  show,
  update,
  destroy,
} = require("../../controllers/admin/productController");
const { uploadOptions } = require("../../hepler/uploadImage");
const router = express.Router();

router.get("/", index);
router.get("/:id", show);
router.post("/add", uploadOptions.array("images"), store);
router.put("/update/:id", uploadOptions.array("images"), update);
router.delete("/delete/:id", destroy);
module.exports = router; 
