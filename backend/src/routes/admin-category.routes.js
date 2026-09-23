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
