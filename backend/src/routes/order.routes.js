/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     tags: [Orders]
 *     summary: List customer orders
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Order list }
 * /api/v1/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get customer order detail
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Order detail }
 * /api/v1/orders/{id}/cancel:
 *   post:
 *     tags: [Orders]
 *     summary: Cancel eligible customer order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Order cancelled }
 */

const express = require("express");
const orderController = require("../controllers/order.controller");
const { authenticate } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { orderIdSchema, listOrdersSchema } = require("../validators/order.validator");

const router = express.Router();

router.use(authenticate);

router.get("/", validate(listOrdersSchema), orderController.listCustomerOrders);
router.get("/:id", validate(orderIdSchema), orderController.getCustomerOrder);
router.post("/:id/cancel", validate(orderIdSchema), orderController.cancelCustomerOrder);

module.exports = router;
