const express = require("express");
const adminController = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const adminBrandRoutes = require("./admin-brand.routes");
const adminCategoryRoutes = require("./admin-category.routes");
const adminProductRoutes = require("./admin-product.routes");
const adminProductVariantRoutes = require("./admin-product-variant.routes");
const adminOrderRoutes = require("./admin-order.routes");
const adminPaymentRoutes = require("./admin-payment.routes");
const adminInventoryMovementRoutes = require("./admin-inventory-movement.routes");
const adminReviewRoutes = require("./admin-review.routes");

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/me", adminController.getAdminMe);
router.use("/brands", adminBrandRoutes);
router.use("/categories", adminCategoryRoutes);
router.use("/products", adminProductRoutes);
router.use("/", adminProductVariantRoutes);
router.use("/orders", adminOrderRoutes);
router.use("/payments", adminPaymentRoutes);
router.use("/", adminInventoryMovementRoutes);
router.use("/reviews", adminReviewRoutes);

module.exports = router;
