const pool = require("../config/database");

const productSelect = `
  p.id,
  p.brand_id,
  p.category_id,
  p.name,
  p.slug,
  p.short_description,
  p.description,
  p.base_price,
  p.status,
  p.is_featured,
  p.created_at,
  p.updated_at,
  p.deleted_at,
  variant_stats.min_effective_price,
  variant_stats.max_effective_price,
  variant_stats.total_stock_quantity,
  variant_stats.active_variant_count,
  b.name AS brand_name,
  b.slug AS brand_slug,
  c.name AS category_name,
  c.slug AS category_slug
`;

function getSortClause(sort) {
  const sortMap = {
    newest: "p.created_at DESC",
    price_asc: "COALESCE(variant_stats.min_effective_price, p.base_price) ASC",
    price_desc: "COALESCE(variant_stats.min_effective_price, p.base_price) DESC",
    name_asc: "p.name ASC",
    name_desc: "p.name DESC",
  };

  return sortMap[sort] || sortMap.newest;
}

function addVariantFilter(conditions, values, sql, value = undefined) {
  if (value !== undefined) {
    values.push(value);
  }

  conditions.push(`
    EXISTS (
      SELECT 1
      FROM product_variants filter_variants
      WHERE filter_variants.product_id = p.id
        ${sql(values.length)}
    )
  `);
}

async function listProducts({
  search,
  brandId,
  categoryId,
  status,
  isFeatured,
  color,
  storage,
  ram,
  minPrice,
  maxPrice,
  availability,
  includeDeleted,
  sort,
  limit,
  offset,
}) {
  const values = [];
  const conditions = [];

  if (!includeDeleted) {
    conditions.push("p.deleted_at IS NULL");
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`(p.name ILIKE $${values.length} OR p.short_description ILIKE $${values.length})`);
  }

  if (brandId) {
    values.push(brandId);
    conditions.push(`p.brand_id = $${values.length}`);
  }

  if (categoryId) {
    values.push(categoryId);
    conditions.push(`p.category_id = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`p.status = $${values.length}`);
  }

  if (typeof isFeatured === "boolean") {
    values.push(isFeatured);
    conditions.push(`p.is_featured = $${values.length}`);
  }

  if (color) {
    addVariantFilter(
      conditions,
      values,
      (index) => `AND filter_variants.status = 'ACTIVE' AND filter_variants.color ILIKE $${index}`,
      `%${color}%`
    );
  }

  if (storage) {
    addVariantFilter(
      conditions,
      values,
      (index) => `AND filter_variants.status = 'ACTIVE' AND filter_variants.storage ILIKE $${index}`,
      `%${storage}%`
    );
  }

  if (ram) {
    addVariantFilter(
      conditions,
      values,
      (index) => `AND filter_variants.status = 'ACTIVE' AND filter_variants.ram ILIKE $${index}`,
      `%${ram}%`
    );
  }

  if (minPrice !== undefined) {
    addVariantFilter(
      conditions,
      values,
      (index) =>
        `AND filter_variants.status = 'ACTIVE' AND COALESCE(filter_variants.sale_price, filter_variants.price) >= $${index}`,
      minPrice
    );
  }

  if (maxPrice !== undefined) {
    addVariantFilter(
      conditions,
      values,
      (index) =>
        `AND filter_variants.status = 'ACTIVE' AND COALESCE(filter_variants.sale_price, filter_variants.price) <= $${index}`,
      maxPrice
    );
  }

  if (availability === "in_stock") {
    conditions.push(`
      EXISTS (
        SELECT 1
        FROM product_variants filter_variants
        WHERE filter_variants.product_id = p.id
          AND filter_variants.status = 'ACTIVE'
          AND filter_variants.stock_quantity > 0
      )
    `);
  }

  if (availability === "out_of_stock") {
    conditions.push(`
      NOT EXISTS (
        SELECT 1
        FROM product_variants filter_variants
        WHERE filter_variants.product_id = p.id
          AND filter_variants.status = 'ACTIVE'
          AND filter_variants.stock_quantity > 0
      )
    `);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;
  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query(
    `
      SELECT ${productSelect}, COUNT(*) OVER()::int AS total_count
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN LATERAL (
        SELECT
          MIN(COALESCE(v.sale_price, v.price)) AS min_effective_price,
          MAX(COALESCE(v.sale_price, v.price)) AS max_effective_price,
          COALESCE(SUM(v.stock_quantity), 0)::int AS total_stock_quantity,
          COUNT(*)::int AS active_variant_count
        FROM product_variants v
        WHERE v.product_id = p.id
          AND v.status = 'ACTIVE'
      ) variant_stats ON true
      ${whereClause}
      ORDER BY ${getSortClause(sort)}
      LIMIT ${limitPlaceholder}
      OFFSET ${offsetPlaceholder}
    `,
    values
  );

  return {
    rows: result.rows,
    total: result.rows[0]?.total_count || 0,
  };
}

async function findById(id) {
  const result = await pool.query(
    `
      SELECT ${productSelect}
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN LATERAL (
        SELECT
          MIN(COALESCE(v.sale_price, v.price)) AS min_effective_price,
          MAX(COALESCE(v.sale_price, v.price)) AS max_effective_price,
          COALESCE(SUM(v.stock_quantity), 0)::int AS total_stock_quantity,
          COUNT(*)::int AS active_variant_count
        FROM product_variants v
        WHERE v.product_id = p.id
          AND v.status = 'ACTIVE'
      ) variant_stats ON true
      WHERE p.id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function findBySlug(slug) {
  const result = await pool.query(
    `
      SELECT ${productSelect}
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN LATERAL (
        SELECT
          MIN(COALESCE(v.sale_price, v.price)) AS min_effective_price,
          MAX(COALESCE(v.sale_price, v.price)) AS max_effective_price,
          COALESCE(SUM(v.stock_quantity), 0)::int AS total_stock_quantity,
          COUNT(*)::int AS active_variant_count
        FROM product_variants v
        WHERE v.product_id = p.id
          AND v.status = 'ACTIVE'
      ) variant_stats ON true
      WHERE p.slug = $1
    `,
    [slug]
  );

  return result.rows[0] || null;
}

async function createProduct({
  brandId,
  categoryId,
  name,
  slug,
  shortDescription,
  description,
  basePrice,
  status,
  isFeatured,
}) {
  const result = await pool.query(
    `
      INSERT INTO products (
        brand_id,
        category_id,
        name,
        slug,
        short_description,
        description,
        base_price,
        status,
        is_featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `,
    [
      brandId || null,
      categoryId || null,
      name,
      slug,
      shortDescription || null,
      description || null,
      basePrice,
      status || "DRAFT",
      isFeatured || false,
    ]
  );

  return findById(result.rows[0].id);
}

async function updateProduct(id, values) {
  const result = await pool.query(
    `
      UPDATE products
      SET
        brand_id = COALESCE($2, brand_id),
        category_id = COALESCE($3, category_id),
        name = COALESCE($4, name),
        slug = COALESCE($5, slug),
        short_description = COALESCE($6, short_description),
        description = COALESCE($7, description),
        base_price = COALESCE($8, base_price),
        status = COALESCE($9, status),
        is_featured = COALESCE($10, is_featured),
        updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [
      id,
      values.brandId,
      values.categoryId,
      values.name,
      values.slug,
      values.shortDescription,
      values.description,
      values.basePrice,
      values.status,
      values.isFeatured,
    ]
  );

  if (!result.rows[0]) return null;
  return findById(result.rows[0].id);
}

async function archiveProduct(id) {
  const result = await pool.query(
    `
      UPDATE products
      SET status = 'INACTIVE', deleted_at = COALESCE(deleted_at, NOW()), updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [id]
  );

  if (!result.rows[0]) return null;
  return findById(result.rows[0].id);
}

module.exports = {
  listProducts,
  findById,
  findBySlug,
  createProduct,
  updateProduct,
  archiveProduct,
};
