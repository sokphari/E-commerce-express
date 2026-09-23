const express = require("express");
const brandController = require("../controllers/brand.controller");
const validate = require("../middleware/validate.middleware");
const {
  listBrandsSchema,
  brandIdSchema,
  createBrandSchema,
  updateBrandSchema,
} = require("../validators/brand.validator");

const router = express.Router();

router.get("/", validate(listBrandsSchema), brandController.listAdminBrands);
router.post("/", validate(createBrandSchema), brandController.createBrand);
router.patch("/:id", validate(updateBrandSchema), brandController.updateBrand);
router.delete("/:id", validate(brandIdSchema), brandController.archiveBrand);

module.exports = router;
