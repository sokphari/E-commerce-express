/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     tags: [Categories]
 *     summary: List active categories
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: parentId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category list
 * /api/v1/categories/{slug}:
 *   get:
 *     tags: [Categories]
 *     summary: Get active category by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category detail
 */

const express = require("express");
const categoryController = require("../controllers/category.controller");
const validate = require("../middleware/validate.middleware");
const { listCategoriesSchema, categorySlugSchema } = require("../validators/category.validator");

const router = express.Router();

router.get("/", validate(listCategoriesSchema), categoryController.listCategories);
router.get("/:slug", validate(categorySlugSchema), categoryController.getCategoryBySlug);

module.exports = router;
