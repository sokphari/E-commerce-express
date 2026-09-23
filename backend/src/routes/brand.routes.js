/**
 * @openapi
 * /api/v1/brands:
 *   get:
 *     tags: [Brands]
 *     summary: List active brands
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Brand list
 * /api/v1/brands/{slug}:
 *   get:
 *     tags: [Brands]
 *     summary: Get active brand by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Brand detail
 */

const express = require("express");
const brandController = require("../controllers/brand.controller");
const validate = require("../middleware/validate.middleware");
const { listBrandsSchema, brandSlugSchema } = require("../validators/brand.validator");

const router = express.Router();

router.get("/", validate(listBrandsSchema), brandController.listBrands);
router.get("/:slug", validate(brandSlugSchema), brandController.getBrandBySlug);

module.exports = router;
