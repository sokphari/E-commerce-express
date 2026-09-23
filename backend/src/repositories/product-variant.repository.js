const pool = require("../config/database");

const variantSelect = `
  v.id,
  v.product_id,
  v.sku,
  v.color,
  v.storage,
  v.ram,
  v.price,
  v.sale_price,
  v.stock_quantity,
  v.low_stock_threshold,
  v.status,
  v.barcode,
  v.weight,
  v.condition,
  v.created_at,
  v.updated_at,
  p.name AS product_name,
  p.slug AS product_slug,
  p.status AS product_status
`;

async function listVariants({ productId, status, lowStockOnly, limit, offset }) {
  const values = [];
  const conditions = [];

  if (productId) {
    values.push(productId);
    conditions.push(`v.product_id = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`v.status = $${values.length}`);
  }

  if (lowStockOnly) {
    conditions.push("v.stock_quantity <= v.low_stock_threshold");
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;
  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query(
    `
      SELECT ${variantSelect}, COUNT(*) OVER()::int AS total_count
      FROM product_variants v
      JOIN products p ON p.id = v.product_id
      ${whereClause}
      ORDER BY v.created_at DESC
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
      SELECT ${variantSelect}
      FROM product_variants v
      JOIN products p ON p.id = v.product_id
      WHERE v.id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function findBySku(sku) {
  const result = await pool.query(
    `
      SELECT ${variantSelect}
      FROM product_variants v
      JOIN products p ON p.id = v.product_id
      WHERE v.sku = $1
    `,
    [sku]
  );

  return result.rows[0] || null;
}

async function createVariant({
  productId,
  sku,
  color,
  storage,
  ram,
  price,
  salePrice,
  stockQuantity,
  lowStockThreshold,
  status,
  barcode,
  weight,
  condition,
}) {
  const result = await pool.query(
    `
      INSERT INTO product_variants (
        product_id,
        sku,
        color,
        storage,
        ram,
        price,
        sale_price,
        stock_quantity,
        low_stock_threshold,
        status,
        barcode,
        weight,
        condition
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `,
    [
      productId,
      sku,
      color || null,
      storage || null,
      ram || null,
      price,
      salePrice ?? null,
      stockQuantity ?? 0,
      lowStockThreshold ?? 5,
      status || "ACTIVE",
      barcode || null,
      weight ?? null,
      condition || null,
    ]
  );

  return findById(result.rows[0].id);
}

async function updateVariant(id, values) {
  const result = await pool.query(
    `
      UPDATE product_variants
      SET
        sku = COALESCE($2, sku),
        color = COALESCE($3, color),
        storage = COALESCE($4, storage),
        ram = COALESCE($5, ram),
        price = COALESCE($6, price),
        sale_price = COALESCE($7, sale_price),
        stock_quantity = COALESCE($8, stock_quantity),
        low_stock_threshold = COALESCE($9, low_stock_threshold),
        status = COALESCE($10, status),
        barcode = COALESCE($11, barcode),
        weight = COALESCE($12, weight),
        condition = COALESCE($13, condition),
        updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [
      id,
      values.sku,
      values.color,
      values.storage,
      values.ram,
      values.price,
      values.salePrice,
      values.stockQuantity,
      values.lowStockThreshold,
      values.status,
      values.barcode,
      values.weight,
      values.condition,
    ]
  );

  if (!result.rows[0]) return null;
  return findById(result.rows[0].id);
}

async function archiveVariant(id) {
  const result = await pool.query(
    `
      UPDATE product_variants
      SET status = 'INACTIVE', updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [id]
  );

  if (!result.rows[0]) return null;
  return findById(result.rows[0].id);
}

module.exports = {
  listVariants,
  findById,
  findBySku,
  createVariant,
  updateVariant,
  archiveVariant,
};
