const express = require("express");
const productController = require("../controllers/product.controller");
const validate = require("../middleware/validate.middleware");
const { listProductsSchema, productSlugSchema } = require("../validators/product.validator");

const router = express.Router();

router.get("/", validate(listProductsSchema), productController.listProducts);
router.get("/:slug", validate(productSlugSchema), productController.getProductBySlug);

module.exports = router;
