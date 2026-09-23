/**
 * @openapi
 * /api/v1/admin/products:
 *   get:
 *     tags: [Admin Catalog]
 *     summary: Admin list products
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Product list }
 *   post:
 *     tags: [Admin Catalog]
 *     summary: Admin create product
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductInput' }
 *     responses:
 *       201: { description: Product created }
 * /api/v1/admin/products/{id}:
 *   patch:
 *     tags: [Admin Catalog]
 *     summary: Admin update product
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductInput' }
 *     responses:
 *       200: { description: Product updated }
 *   delete:
 *     tags: [Admin Catalog]
 *     summary: Admin archive product
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Product archived }
 */

const express = require("express");
const productController = require("../controllers/product.controller");
const validate = require("../middleware/validate.middleware");
const {
  listProductsSchema,
  productIdSchema,
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

const router = express.Router();

router.get("/", validate(listProductsSchema), productController.listAdminProducts);
router.post("/", validate(createProductSchema), productController.createProduct);
router.patch("/:id", validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", validate(productIdSchema), productController.archiveProduct);

module.exports = router;
