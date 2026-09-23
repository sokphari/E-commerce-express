/**
 * @openapi
 * /api/v1/checkout:
 *   post:
 *     tags: [Checkout]
 *     summary: Checkout cart and create order
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CheckoutInput' }
 *     responses:
 *       201: { description: Checkout completed }
 */

const express = require("express");
const checkoutController = require("../controllers/checkout.controller");
const { authenticate } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { checkoutSchema } = require("../validators/checkout.validator");

const router = express.Router();

router.post("/", authenticate, validate(checkoutSchema), checkoutController.checkout);

module.exports = router;
