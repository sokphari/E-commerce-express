/**
 * @openapi
 * /api/v1/admin/inventory-movements:
 *   get:
 *     tags: [Admin Inventory]
 *     summary: Admin list inventory movements
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Inventory movement list }
 * /api/v1/admin/variants/{variantId}/inventory-movements:
 *   get:
 *     tags: [Admin Inventory]
 *     summary: Admin list movement history for one variant
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Variant movement history }
 */

const express = require("express");
const inventoryMovementController = require("../controllers/inventory-movement.controller");
const validate = require("../middleware/validate.middleware");
const {
  listInventoryMovementsSchema,
  variantMovementSchema,
} = require("../validators/inventory-movement.validator");

const router = express.Router();

router.get(
  "/inventory-movements",
  validate(listInventoryMovementsSchema),
  inventoryMovementController.listMovements
);
router.get(
  "/variants/:variantId/inventory-movements",
  validate(variantMovementSchema),
  inventoryMovementController.listVariantMovements
);

module.exports = router;
