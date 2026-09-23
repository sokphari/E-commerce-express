const pool = require("../config/database");

const reviewSelect = `
  r.id,
  r.user_id,
  r.product_id,
  r.rating,
  r.comment,
  r.status,
  r.created_at,
  r.updated_at,
  u.first_name,
  u.last_name,
  p.name AS product_name,
  p.slug AS product_slug
`;

async function listReviews({ productId, userId, status, limit, offset }) {
  const values = [];
  const conditions = [];

  if (productId) {
    values.push(productId);
    conditions.push(`r.product_id = $${values.length}`);
  }

  if (userId) {
    values.push(userId);
    conditions.push(`r.user_id = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`r.status = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;
  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query(
    `
      SELECT ${reviewSelect}, COUNT(*) OVER()::int AS total_count
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      JOIN products p ON p.id = r.product_id
      ${whereClause}
      ORDER BY r.created_at DESC
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
      SELECT ${reviewSelect}
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      JOIN products p ON p.id = r.product_id
      WHERE r.id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function findByUserAndProduct(userId, productId) {
  const result = await pool.query(
    `
      SELECT ${reviewSelect}
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      JOIN products p ON p.id = r.product_id
      WHERE r.user_id = $1
        AND r.product_id = $2
    `,
    [userId, productId]
  );

  return result.rows[0] || null;
}

async function hasDeliveredPurchase(userId, productId) {
  const result = await pool.query(
    `
      SELECT 1
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = $1
        AND oi.product_id = $2
        AND o.order_status = 'DELIVERED'
      LIMIT 1
    `,
    [userId, productId]
  );

  return Boolean(result.rows[0]);
}

async function createReview({ userId, productId, rating, comment }) {
  const result = await pool.query(
    `
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    [userId, productId, rating, comment || null]
  );

  return findById(result.rows[0].id);
}

async function updateReview(id, { rating, comment }) {
  const result = await pool.query(
    `
      UPDATE reviews
      SET
        rating = COALESCE($2, rating),
        comment = COALESCE($3, comment),
        status = 'PENDING',
        updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [id, rating, comment]
  );

  if (!result.rows[0]) return null;
  return findById(result.rows[0].id);
}

async function updateStatus(id, status) {
  const result = await pool.query(
    `
      UPDATE reviews
      SET status = $2::review_status, updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [id, status]
  );

  if (!result.rows[0]) return null;
  return findById(result.rows[0].id);
}

async function deleteReview(id) {
  const result = await pool.query("DELETE FROM reviews WHERE id = $1 RETURNING id", [id]);
  return result.rows[0] || null;
}

module.exports = {
  listReviews,
  findById,
  findByUserAndProduct,
  hasDeliveredPurchase,
  createReview,
  updateReview,
  updateStatus,
  deleteReview,
};
