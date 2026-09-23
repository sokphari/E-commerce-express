const categoryService = require("../services/category.service");

async function listCategories(req, res, next) {
  try {
    const result = await categoryService.listCategories(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function listAdminCategories(req, res, next) {
  try {
    const result = await categoryService.listAdminCategories(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function getCategoryBySlug(req, res, next) {
  try {
    const category = await categoryService.getCategoryBySlug(req.validated.params.slug);

    res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.validated.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(
      req.validated.params.id,
      req.validated.body
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function archiveCategory(req, res, next) {
  try {
    const category = await categoryService.archiveCategory(req.validated.params.id);

    res.status(200).json({
      success: true,
      message: "Category archived successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCategories,
  listAdminCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  archiveCategory,
};
