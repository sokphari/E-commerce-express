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
