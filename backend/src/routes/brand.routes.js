const express = require("express");
const brandController = require("../controllers/brand.controller");
const validate = require("../middleware/validate.middleware");
const { listBrandsSchema, brandSlugSchema } = require("../validators/brand.validator");

const router = express.Router();

router.get("/", validate(listBrandsSchema), brandController.listBrands);
router.get("/:slug", validate(brandSlugSchema), brandController.getBrandBySlug);

module.exports = router;
