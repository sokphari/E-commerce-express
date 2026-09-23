/**
 * @openapi
 * /api/v1/admin/payments:
 *   get:
 *     tags: [Admin Payments]
 *     summary: Admin list payments
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Payment list }
 * /api/v1/admin/payments/{id}:
 *   get:
 *     tags: [Admin Payments]
 *     summary: Admin get payment detail
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Payment detail }
 * /api/v1/admin/payments/{id}/status:
 *   patch:
 *     tags: [Admin Payments]
 *     summary: Admin update payment status
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
 *                 enum: [PENDING, PAID, FAILED, REFUNDED]
 *                 example: PAID
 *     responses:
 *       200: { description: Payment status updated }
 */

const express = require("express");
const paymentController = require("../controllers/payment.controller");
const validate = require("../middleware/validate.middleware");
const {
  paymentIdSchema,
  listPaymentsSchema,
  updatePaymentStatusSchema,
} = require("../validators/payment.validator");

const router = express.Router();

router.get("/", validate(listPaymentsSchema), paymentController.listPayments);
router.get("/:id", validate(paymentIdSchema), paymentController.getPayment);
router.patch("/:id/status", validate(updatePaymentStatusSchema), paymentController.updatePaymentStatus);

module.exports = router;
