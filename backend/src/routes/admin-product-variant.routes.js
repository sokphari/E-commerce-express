const express = require("express");
const variantController = require("../controllers/product-variant.controller");
const validate = require("../middleware/validate.middleware");
const {
  listVariantsSchema,
  createVariantSchema,
  updateVariantSchema,
  productVariantIdSchema,
  productVariantProductIdSchema,
} = require("../validators/product-variant.validator");

const router = express.Router();

router.get("/variants", validate(listVariantsSchema), variantController.listAdminVariants);
router.get(
  "/products/:productId/variants",
  validate(productVariantProductIdSchema),
  variantController.listProductVariants
);
router.post(
  "/products/:productId/variants",
  validate(createVariantSchema),
  variantController.createVariant
);
router.patch("/variants/:id", validate(updateVariantSchema), variantController.updateVariant);
router.delete("/variants/:id", validate(productVariantIdSchema), variantController.archiveVariant);

module.exports = router;
