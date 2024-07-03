import express from "express";
import {
  ProductsPage,
  ProductPage,
  CategoryPage,
} from "../../controllers/customer/customerController.js";

const router = express.Router();

router.get("/products", ProductsPage);
router.get("/product/:slug", ProductPage);
router.get("/category", CategoryPage);

export default router;
