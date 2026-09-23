const pool = require("../config/database");

const categorySelect = `
  id,
  parent_id,
  name,
  slug,
  description,
  image_url,
  status,
  created_at,
  updated_at
`;

async function listCategories({ search, status, parentId, limit, offset }) {
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

  if (parentId === "root") {
    conditions.push("parent_id IS NULL");
  } else if (parentId) {
    values.push(parentId);
    conditions.push(`parent_id = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;
  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query(
    `
      SELECT ${categorySelect}, COUNT(*) OVER()::int AS total_count
      FROM categories
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
  const result = await pool.query(`SELECT ${categorySelect} FROM categories WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function findBySlug(slug) {
  const result = await pool.query(`SELECT ${categorySelect} FROM categories WHERE slug = $1`, [
    slug,
  ]);
  return result.rows[0] || null;
}

async function createCategory({ parentId, name, slug, description, imageUrl, status }) {
  const result = await pool.query(
    `
      INSERT INTO categories (parent_id, name, slug, description, image_url, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ${categorySelect}
    `,
    [parentId || null, name, slug, description || null, imageUrl || null, status || "ACTIVE"]
  );

  return result.rows[0];
}

async function updateCategory(id, values) {
  const result = await pool.query(
    `
      UPDATE categories
      SET
        parent_id = COALESCE($2, parent_id),
        name = COALESCE($3, name),
        slug = COALESCE($4, slug),
        description = COALESCE($5, description),
        image_url = COALESCE($6, image_url),
        status = COALESCE($7, status),
        updated_at = NOW()
      WHERE id = $1
      RETURNING ${categorySelect}
    `,
    [
      id,
      values.parentId,
      values.name,
      values.slug,
      values.description,
      values.imageUrl,
      values.status,
    ]
  );

  return result.rows[0] || null;
}

async function archiveCategory(id) {
  const result = await pool.query(
    `
      UPDATE categories
      SET status = 'INACTIVE', updated_at = NOW()
      WHERE id = $1
      RETURNING ${categorySelect}
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  listCategories,
  findById,
  findBySlug,
  createCategory,
  updateCategory,
  archiveCategory,
};
