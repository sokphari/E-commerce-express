const ApiError = require("../utils/api-error");
const { sanitizeCategory } = require("../utils/category");
const { createSlug } = require("../utils/slug");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const categoryRepository = require("../repositories/category.repository");

async function ensureUniqueSlug(slug, currentCategoryId = null) {
  const existingCategory = await categoryRepository.findBySlug(slug);

  if (existingCategory && existingCategory.id !== currentCategoryId) {
    throw new ApiError(409, "Category slug already exists");
  }
}

async function ensureValidParent(parentId, currentCategoryId = null) {
  if (!parentId) return;

  if (parentId === currentCategoryId) {
    throw new ApiError(400, "Category cannot be its own parent");
  }

  const parent = await categoryRepository.findById(parentId);

  if (!parent) {
    throw new ApiError(404, "Parent category not found");
  }
}

async function listCategories(query) {
  const pagination = getPagination(query);
  const { rows, total } = await categoryRepository.listCategories({
    search: query.search,
    status: query.status || "ACTIVE",
    parentId: query.parentId,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeCategory),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function listAdminCategories(query) {
  const pagination = getPagination(query);
  const { rows, total } = await categoryRepository.listCategories({
    search: query.search,
    status: query.status,
    parentId: query.parentId,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeCategory),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function getCategoryBySlug(slug) {
  const category = await categoryRepository.findBySlug(slug);

  if (!category || category.status !== "ACTIVE") {
    throw new ApiError(404, "Category not found");
  }

  return sanitizeCategory(category);
}

async function createCategory(input) {
  const slug = createSlug(input.slug || input.name);
  await ensureUniqueSlug(slug);
  await ensureValidParent(input.parentId);

  const category = await categoryRepository.createCategory({
    ...input,
    slug,
  });

  return sanitizeCategory(category);
}

async function updateCategory(id, input) {
  const existingCategory = await categoryRepository.findById(id);

  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  const values = { ...input };

  if (input.name || input.slug) {
    values.slug = createSlug(input.slug || input.name);
    await ensureUniqueSlug(values.slug, id);
  }

  if (input.parentId) {
    await ensureValidParent(input.parentId, id);
  }

  const category = await categoryRepository.updateCategory(id, values);
  return sanitizeCategory(category);
}

async function archiveCategory(id) {
  const category = await categoryRepository.archiveCategory(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return sanitizeCategory(category);
}

module.exports = {
  listCategories,
  listAdminCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  archiveCategory,
};
