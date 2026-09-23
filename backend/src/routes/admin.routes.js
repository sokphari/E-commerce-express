const express = require("express");
const adminController = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const adminBrandRoutes = require("./admin-brand.routes");
const adminCategoryRoutes = require("./admin-category.routes");
const adminProductRoutes = require("./admin-product.routes");

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/me", adminController.getAdminMe);
router.use("/brands", adminBrandRoutes);
router.use("/categories", adminCategoryRoutes);
router.use("/products", adminProductRoutes);

module.exports = router;
