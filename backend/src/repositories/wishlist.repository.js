const pool = require("../config/database");

const wishlistSelect = `
  w.id,
  w.user_id,
  w.product_id,
  w.created_at,
  p.name AS product_name,
  p.slug AS product_slug,
  p.short_description AS product_short_description,
  p.base_price AS product_base_price,
  p.status AS product_status,
  p.is_featured AS product_is_featured,
  p.deleted_at AS product_deleted_at,
  b.id AS brand_id,
  b.name AS brand_name,
  b.slug AS brand_slug,
  c.id AS category_id,
  c.name AS category_name,
  c.slug AS category_slug
`;

async function listByUserId(userId) {
  const result = await pool.query(
    `
      SELECT ${wishlistSelect}
      FROM wishlists w
      JOIN products p ON p.id = w.product_id
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

async function findByUserAndProduct(userId, productId) {
  const result = await pool.query(
    `
      SELECT ${wishlistSelect}
      FROM wishlists w
      JOIN products p ON p.id = w.product_id
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE w.user_id = $1
        AND w.product_id = $2
    `,
    [userId, productId]
  );

  return result.rows[0] || null;
}

async function add(userId, productId) {
  const result = await pool.query(
    `
      INSERT INTO wishlists (user_id, product_id)
      VALUES ($1, $2)
      RETURNING id
    `,
    [userId, productId]
  );

  return findById(result.rows[0].id);
}

async function findById(id) {
  const result = await pool.query(
    `
      SELECT ${wishlistSelect}
      FROM wishlists w
      JOIN products p ON p.id = w.product_id
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE w.id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function remove(userId, productId) {
  const result = await pool.query(
    `
      DELETE FROM wishlists
      WHERE user_id = $1
        AND product_id = $2
      RETURNING id
    `,
    [userId, productId]
  );

  return result.rows[0] || null;
}

module.exports = {
  listByUserId,
  findByUserAndProduct,
  add,
  remove,
};
