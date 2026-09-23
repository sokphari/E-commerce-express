const express = require("express");
const categoryController = require("../controllers/category.controller");
const validate = require("../middleware/validate.middleware");
const { listCategoriesSchema, categorySlugSchema } = require("../validators/category.validator");

const router = express.Router();

router.get("/", validate(listCategoriesSchema), categoryController.listCategories);
router.get("/:slug", validate(categorySlugSchema), categoryController.getCategoryBySlug);

module.exports = router;
