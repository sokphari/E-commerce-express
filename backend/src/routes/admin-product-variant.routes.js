/**
 * @openapi
 * /api/v1/admin/variants:
 *   get:
 *     tags: [Admin Catalog]
 *     summary: Admin list variants
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Variant list }
 * /api/v1/admin/products/{productId}/variants:
 *   get:
 *     tags: [Admin Catalog]
 *     summary: Admin list variants for product
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Variant list }
 *   post:
 *     tags: [Admin Catalog]
 *     summary: Admin create product variant
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/VariantInput' }
 *     responses:
 *       201: { description: Variant created }
 * /api/v1/admin/variants/{id}:
 *   patch:
 *     tags: [Admin Catalog]
 *     summary: Admin update variant
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/VariantInput' }
 *     responses:
 *       200: { description: Variant updated }
 *   delete:
 *     tags: [Admin Catalog]
 *     summary: Admin archive variant
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Variant archived }
 */

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
