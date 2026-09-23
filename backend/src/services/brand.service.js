const ApiError = require("../utils/api-error");
const { sanitizeBrand } = require("../utils/brand");
const { createSlug } = require("../utils/slug");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const brandRepository = require("../repositories/brand.repository");

async function ensureUniqueSlug(slug, currentBrandId = null) {
  const existingBrand = await brandRepository.findBySlug(slug);

  if (existingBrand && existingBrand.id !== currentBrandId) {
    throw new ApiError(409, "Brand slug already exists");
  }
}

async function listBrands(query) {
  const pagination = getPagination(query);
  const { rows, total } = await brandRepository.listBrands({
    search: query.search,
    status: query.status || "ACTIVE",
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeBrand),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function listAdminBrands(query) {
  const pagination = getPagination(query);
  const { rows, total } = await brandRepository.listBrands({
    search: query.search,
    status: query.status,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeBrand),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function getBrandBySlug(slug) {
  const brand = await brandRepository.findBySlug(slug);

  if (!brand || brand.status !== "ACTIVE") {
    throw new ApiError(404, "Brand not found");
  }

  return sanitizeBrand(brand);
}

async function createBrand(input) {
  const slug = createSlug(input.slug || input.name);
  await ensureUniqueSlug(slug);

  const brand = await brandRepository.createBrand({
    ...input,
    slug,
  });

  return sanitizeBrand(brand);
}

async function updateBrand(id, input) {
  const existingBrand = await brandRepository.findById(id);

  if (!existingBrand) {
    throw new ApiError(404, "Brand not found");
  }

  const values = { ...input };

  if (input.name || input.slug) {
    values.slug = createSlug(input.slug || input.name);
    await ensureUniqueSlug(values.slug, id);
  }

  const brand = await brandRepository.updateBrand(id, values);
  return sanitizeBrand(brand);
}

async function archiveBrand(id) {
  const brand = await brandRepository.archiveBrand(id);

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  return sanitizeBrand(brand);
}

module.exports = {
  listBrands,
  listAdminBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  archiveBrand,
};
