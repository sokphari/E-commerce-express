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
