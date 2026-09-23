const pool = require("../config/database");

const movementSelect = `
  im.id,
  im.product_variant_id,
  im.type,
  im.quantity,
  im.reference_type,
  im.reference_id,
  im.note,
  im.created_by,
  im.created_at,
  v.sku,
  v.color,
  v.storage,
  v.ram,
  p.id AS product_id,
  p.name AS product_name,
  p.slug AS product_slug
`;

async function listMovements({ productVariantId, type, referenceType, referenceId, limit, offset }) {
  const values = [];
  const conditions = [];

  if (productVariantId) {
    values.push(productVariantId);
    conditions.push(`im.product_variant_id = $${values.length}`);
  }

  if (type) {
    values.push(type);
    conditions.push(`im.type = $${values.length}`);
  }

  if (referenceType) {
    values.push(referenceType);
    conditions.push(`im.reference_type = $${values.length}`);
  }

  if (referenceId) {
    values.push(referenceId);
    conditions.push(`im.reference_id = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;
  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query(
    `
      SELECT ${movementSelect}, COUNT(*) OVER()::int AS total_count
      FROM inventory_movements im
      JOIN product_variants v ON v.id = im.product_variant_id
      JOIN products p ON p.id = v.product_id
      ${whereClause}
      ORDER BY im.created_at DESC
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

module.exports = {
  listMovements,
};
