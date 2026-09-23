/**
 * @openapi
 * /api/v1/admin/categories:
 *   get:
 *     tags: [Admin Catalog]
 *     summary: Admin list categories
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Category list }
 *   post:
 *     tags: [Admin Catalog]
 *     summary: Admin create category
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryInput' }
 *     responses:
 *       201: { description: Category created }
 * /api/v1/admin/categories/{id}:
 *   patch:
 *     tags: [Admin Catalog]
 *     summary: Admin update category
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryInput' }
 *     responses:
 *       200: { description: Category updated }
 *   delete:
 *     tags: [Admin Catalog]
 *     summary: Admin archive category
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Category archived }
 */

const express = require("express");
const categoryController = require("../controllers/category.controller");
const validate = require("../middleware/validate.middleware");
const {
  listCategoriesSchema,
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/category.validator");

const router = express.Router();

router.get("/", validate(listCategoriesSchema), categoryController.listAdminCategories);
router.post("/", validate(createCategorySchema), categoryController.createCategory);
router.patch("/:id", validate(updateCategorySchema), categoryController.updateCategory);
router.delete("/:id", validate(categoryIdSchema), categoryController.archiveCategory);

module.exports = router;
