const pool = require("../config/database");

const brandSelect = `
  id,
  name,
  slug,
  description,
  logo_url,
  status,
  created_at,
  updated_at
`;

async function listBrands({ search, status, limit, offset }) {
  const values = [];
  const conditions = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;
  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query(
    `
      SELECT ${brandSelect}, COUNT(*) OVER()::int AS total_count
      FROM brands
      ${whereClause}
      ORDER BY created_at DESC
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
  const result = await pool.query(`SELECT ${brandSelect} FROM brands WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function findBySlug(slug) {
  const result = await pool.query(`SELECT ${brandSelect} FROM brands WHERE slug = $1`, [slug]);
  return result.rows[0] || null;
}

async function createBrand({ name, slug, description, logoUrl, status }) {
  const result = await pool.query(
    `
      INSERT INTO brands (name, slug, description, logo_url, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ${brandSelect}
    `,
    [name, slug, description || null, logoUrl || null, status || "ACTIVE"]
  );

  return result.rows[0];
}

async function updateBrand(id, values) {
  const result = await pool.query(
    `
      UPDATE brands
      SET
        name = COALESCE($2, name),
        slug = COALESCE($3, slug),
        description = COALESCE($4, description),
        logo_url = COALESCE($5, logo_url),
        status = COALESCE($6, status),
        updated_at = NOW()
      WHERE id = $1
      RETURNING ${brandSelect}
    `,
    [
      id,
      values.name,
      values.slug,
      values.description,
      values.logoUrl,
      values.status,
    ]
  );

  return result.rows[0] || null;
}

async function archiveBrand(id) {
  const result = await pool.query(
    `
      UPDATE brands
      SET status = 'INACTIVE', updated_at = NOW()
      WHERE id = $1
      RETURNING ${brandSelect}
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  listBrands,
  findById,
  findBySlug,
  createBrand,
  updateBrand,
  archiveBrand,
};
