const ApiError = require("../utils/api-error");
const { sanitizeProductVariant } = require("../utils/product-variant");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const productRepository = require("../repositories/product.repository");
const variantRepository = require("../repositories/product-variant.repository");

async function ensureProductCanHaveVariant(productId) {
  const product = await productRepository.findById(productId);

  if (!product || product.deleted_at) {
    throw new ApiError(404, "Product not found");
  }

  return product;
}

async function ensureUniqueSku(sku, currentVariantId = null) {
  const existingVariant = await variantRepository.findBySku(sku);

  if (existingVariant && existingVariant.id !== currentVariantId) {
    throw new ApiError(409, "Variant SKU already exists");
  }
}

function ensureValidSalePrice(input, existingVariant = null) {
  const price = input.price ?? existingVariant?.price;
  const salePrice = input.salePrice ?? existingVariant?.sale_price;

  if (salePrice !== undefined && salePrice !== null && Number(salePrice) > Number(price)) {
    throw new ApiError(400, "Sale price cannot be greater than price");
  }
}

async function listAdminVariants(query) {
  const pagination = getPagination(query);
  const { rows, total } = await variantRepository.listVariants({
    productId: query.productId,
    status: query.status,
    lowStockOnly: query.lowStockOnly,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeProductVariant),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function listProductVariants(productId, query = {}) {
  await ensureProductCanHaveVariant(productId);

  const pagination = getPagination(query);
  const { rows, total } = await variantRepository.listVariants({
    productId,
    status: query.status,
    lowStockOnly: query.lowStockOnly,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeProductVariant),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function createVariant(productId, input) {
  await ensureProductCanHaveVariant(productId);
  await ensureUniqueSku(input.sku);
  ensureValidSalePrice(input);

  const variant = await variantRepository.createVariant({
    ...input,
    productId,
  });

  return sanitizeProductVariant(variant);
}

async function updateVariant(id, input) {
  const existingVariant = await variantRepository.findById(id);

  if (!existingVariant) {
    throw new ApiError(404, "Variant not found");
  }

  if (input.sku) {
    await ensureUniqueSku(input.sku, id);
  }

  ensureValidSalePrice(input, existingVariant);

  const variant = await variantRepository.updateVariant(id, input);
  return sanitizeProductVariant(variant);
}

async function archiveVariant(id) {
  const variant = await variantRepository.archiveVariant(id);

  if (!variant) {
    throw new ApiError(404, "Variant not found");
  }

  return sanitizeProductVariant(variant);
}

module.exports = {
  listAdminVariants,
  listProductVariants,
  createVariant,
  updateVariant,
  archiveVariant,
};
