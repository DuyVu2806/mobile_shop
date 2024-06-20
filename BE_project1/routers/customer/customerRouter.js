const express = require("express");
const {
  ProductsPage,
  ProductPage,
  CategoryPage,
} = require("../../controllers/customer/customerController");
const router = express.Router();

router.get("/products", ProductsPage);
router.get("/product/:slug", ProductPage);
router.get("/category", CategoryPage);
module.exports = router;
