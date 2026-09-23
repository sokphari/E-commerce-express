/**
 * @openapi
 * /api/v1/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get customer cart
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Cart detail }
 *   delete:
 *     tags: [Cart]
 *     summary: Clear cart
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Cart cleared }
 * /api/v1/cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add variant to cart
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CartItemInput' }
 *     responses:
 *       200: { description: Cart item added }
 * /api/v1/cart/items/{id}:
 *   patch:
 *     tags: [Cart]
 *     summary: Update cart item quantity
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity: { type: integer, example: 2 }
 *     responses:
 *       200: { description: Cart item updated }
 *   delete:
 *     tags: [Cart]
 *     summary: Remove cart item
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Cart item removed }
 */

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
