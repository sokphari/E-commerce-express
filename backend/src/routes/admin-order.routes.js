/**
 * @openapi
 * /api/v1/admin/orders:
 *   get:
 *     tags: [Admin Orders]
 *     summary: Admin list all orders
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Order list }
 * /api/v1/admin/orders/{id}:
 *   get:
 *     tags: [Admin Orders]
 *     summary: Admin get order detail
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Order detail }
 * /api/v1/admin/orders/{id}/status:
 *   patch:
 *     tags: [Admin Orders]
 *     summary: Admin update order status
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
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED]
 *                 example: CONFIRMED
 *     responses:
 *       200: { description: Order status updated }
 */

const express = require("express");
const orderController = require("../controllers/order.controller");
const validate = require("../middleware/validate.middleware");
const {
  orderIdSchema,
  listOrdersSchema,
  updateOrderStatusSchema,
} = require("../validators/order.validator");

const router = express.Router();

router.get("/", validate(listOrdersSchema), orderController.listAdminOrders);
router.get("/:id", validate(orderIdSchema), orderController.getAdminOrder);
router.patch("/:id/status", validate(updateOrderStatusSchema), orderController.updateAdminOrderStatus);

module.exports = router;
