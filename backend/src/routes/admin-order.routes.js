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
