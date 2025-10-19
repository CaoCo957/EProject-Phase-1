const express = require("express");
const ProductController = require("../controllers/productController");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();
const productController = new ProductController();

// KHÔNG CÓ /products ở đây
router.post("/", isAuthenticated, productController.createProduct);
router.get("/", isAuthenticated, productController.getProducts);
router.get("/:id", isAuthenticated, productController.getProductById); // Chỉ có /:id
router.post("/buy", isAuthenticated, productController.createOrder);

module.exports = router;