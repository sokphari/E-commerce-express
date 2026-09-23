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
