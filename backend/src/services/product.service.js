const ApiError = require("../utils/api-error");
const { sanitizeProduct } = require("../utils/product");
const { createSlug } = require("../utils/slug");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const productRepository = require("../repositories/product.repository");
const brandRepository = require("../repositories/brand.repository");
const categoryRepository = require("../repositories/category.repository");

async function ensureUniqueSlug(slug, currentProductId = null) {
  const existingProduct = await productRepository.findBySlug(slug);

  if (existingProduct && existingProduct.id !== currentProductId) {
    throw new ApiError(409, "Product slug already exists");
  }
}

async function ensureValidBrand(brandId) {
  if (!brandId) return;

  const brand = await brandRepository.findById(brandId);

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  if (brand.status !== "ACTIVE") {
    throw new ApiError(400, "Brand is not active");
  }
}

async function ensureValidCategory(categoryId) {
  if (!categoryId) return;

  const category = await categoryRepository.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.status !== "ACTIVE") {
    throw new ApiError(400, "Category is not active");
  }
}

async function listProducts(query) {
  const pagination = getPagination(query);
  const { rows, total } = await productRepository.listProducts({
    search: query.search,
    brandId: query.brandId,
    categoryId: query.categoryId,
    status: "ACTIVE",
    isFeatured: query.isFeatured,
    includeDeleted: false,
    sort: query.sort,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeProduct),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function listAdminProducts(query) {
  const pagination = getPagination(query);
  const { rows, total } = await productRepository.listProducts({
    search: query.search,
    brandId: query.brandId,
    categoryId: query.categoryId,
    status: query.status,
    isFeatured: query.isFeatured,
    includeDeleted: true,
    sort: query.sort,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeProduct),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function getProductBySlug(slug) {
  const product = await productRepository.findBySlug(slug);

  if (!product || product.status !== "ACTIVE" || product.deleted_at) {
    throw new ApiError(404, "Product not found");
  }

  return sanitizeProduct(product);
}

async function createProduct(input) {
  const slug = createSlug(input.slug || input.name);
  await ensureUniqueSlug(slug);
  await ensureValidBrand(input.brandId);
  await ensureValidCategory(input.categoryId);

  const product = await productRepository.createProduct({
    ...input,
    slug,
  });

  return sanitizeProduct(product);
}

async function updateProduct(id, input) {
  const existingProduct = await productRepository.findById(id);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  const values = { ...input };

  if (input.name || input.slug) {
    values.slug = createSlug(input.slug || input.name);
    await ensureUniqueSlug(values.slug, id);
  }

  if (input.brandId) {
    await ensureValidBrand(input.brandId);
  }

  if (input.categoryId) {
    await ensureValidCategory(input.categoryId);
  }

  const product = await productRepository.updateProduct(id, values);
  return sanitizeProduct(product);
}

async function archiveProduct(id) {
  const product = await productRepository.archiveProduct(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return sanitizeProduct(product);
}

module.exports = {
  listProducts,
  listAdminProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  archiveProduct,
};
