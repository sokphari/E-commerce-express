const express = require("express");
const productController = require("../controllers/product.controller");
const validate = require("../middleware/validate.middleware");
const {
  listProductsSchema,
  productIdSchema,
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

const router = express.Router();

router.get("/", validate(listProductsSchema), productController.listAdminProducts);
router.post("/", validate(createProductSchema), productController.createProduct);
router.patch("/:id", validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", validate(productIdSchema), productController.archiveProduct);

module.exports = router;
