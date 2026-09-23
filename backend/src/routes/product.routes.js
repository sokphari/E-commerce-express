/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     tags: [Products]
 *     summary: List active products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: brandId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: color
 *         schema: { type: string }
 *       - in: query
 *         name: storage
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: availability
 *         schema: { type: string, enum: [in_stock, out_of_stock] }
 *     responses:
 *       200:
 *         description: Product list
 * /api/v1/products/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Get active product by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product detail
 */

const express = require("express");
const productController = require("../controllers/product.controller");
const validate = require("../middleware/validate.middleware");
const { listProductsSchema, productSlugSchema } = require("../validators/product.validator");

const router = express.Router();

router.get("/", validate(listProductsSchema), productController.listProducts);
router.get("/:slug", validate(productSlugSchema), productController.getProductBySlug);

module.exports = router;
