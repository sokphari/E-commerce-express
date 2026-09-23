const express = require("express");
const cartController = require("../controllers/cart.controller");
const { authenticate } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  cartItemIdSchema,
  addCartItemSchema,
  updateCartItemSchema,
} = require("../validators/cart.validator");

const router = express.Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/items", validate(addCartItemSchema), cartController.addItem);
router.patch("/items/:id", validate(updateCartItemSchema), cartController.updateItem);
router.delete("/items/:id", validate(cartItemIdSchema), cartController.removeItem);
router.delete("/", cartController.clearCart);

module.exports = router;
