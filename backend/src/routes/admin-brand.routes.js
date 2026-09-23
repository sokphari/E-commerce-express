/**
 * @openapi
 * /api/v1/admin/brands:
 *   get:
 *     tags: [Admin Catalog]
 *     summary: Admin list brands
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Brand list }
 *   post:
 *     tags: [Admin Catalog]
 *     summary: Admin create brand
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BrandInput' }
 *     responses:
 *       201: { description: Brand created }
 * /api/v1/admin/brands/{id}:
 *   patch:
 *     tags: [Admin Catalog]
 *     summary: Admin update brand
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BrandInput' }
 *     responses:
 *       200: { description: Brand updated }
 *   delete:
 *     tags: [Admin Catalog]
 *     summary: Admin archive brand
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Brand archived }
 */

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
