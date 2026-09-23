const pool = require("../config/database");

const cartSelect = `
  id,
  user_id,
  created_at,
  updated_at
`;

const cartItemSelect = `
  ci.id,
  ci.cart_id,
  ci.product_variant_id,
  ci.quantity,
  ci.created_at,
  ci.updated_at,
  v.product_id,
  v.sku,
  v.color,
  v.storage,
  v.ram,
  v.price,
  v.sale_price,
  v.stock_quantity,
  v.status AS variant_status,
  p.name AS product_name,
  p.slug AS product_slug,
  p.status AS product_status
`;

async function getOrCreateCart(userId) {
  const existing = await pool.query(`SELECT ${cartSelect} FROM carts WHERE user_id = $1`, [userId]);

  if (existing.rows[0]) {
    return existing.rows[0];
  }

  const created = await pool.query(
    `
      INSERT INTO carts (user_id)
      VALUES ($1)
      RETURNING ${cartSelect}
    `,
    [userId]
  );

  return created.rows[0];
}

async function listItems(cartId) {
  const result = await pool.query(
    `
      SELECT ${cartItemSelect}
      FROM cart_items ci
      JOIN product_variants v ON v.id = ci.product_variant_id
      JOIN products p ON p.id = v.product_id
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at DESC
    `,
    [cartId]
  );

  return result.rows;
}

async function findItemByVariant(cartId, productVariantId) {
  const result = await pool.query(
    `
      SELECT ${cartItemSelect}
      FROM cart_items ci
      JOIN product_variants v ON v.id = ci.product_variant_id
      JOIN products p ON p.id = v.product_id
      WHERE ci.cart_id = $1
        AND ci.product_variant_id = $2
    `,
    [cartId, productVariantId]
  );

  return result.rows[0] || null;
}

async function findItemByIdForUser(itemId, userId) {
  const result = await pool.query(
    `
      SELECT ${cartItemSelect}
      FROM cart_items ci
      JOIN carts c ON c.id = ci.cart_id
      JOIN product_variants v ON v.id = ci.product_variant_id
      JOIN products p ON p.id = v.product_id
      WHERE ci.id = $1
        AND c.user_id = $2
    `,
    [itemId, userId]
  );

  return result.rows[0] || null;
}

async function addItem(cartId, productVariantId, quantity) {
  const result = await pool.query(
    `
      INSERT INTO cart_items (cart_id, product_variant_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
    [cartId, productVariantId, quantity]
  );

  return result.rows[0];
}

async function updateItemQuantity(itemId, quantity) {
  const result = await pool.query(
    `
      UPDATE cart_items
      SET quantity = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [itemId, quantity]
  );

  return result.rows[0] || null;
}

async function deleteItemForUser(itemId, userId) {
  const result = await pool.query(
    `
      DELETE FROM cart_items ci
      USING carts c
      WHERE ci.cart_id = c.id
        AND ci.id = $1
        AND c.user_id = $2
      RETURNING ci.id
    `,
    [itemId, userId]
  );

  return result.rows[0] || null;
}

async function clearCart(cartId) {
  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
}

module.exports = {
  getOrCreateCart,
  listItems,
  findItemByVariant,
  findItemByIdForUser,
  addItem,
  updateItemQuantity,
  deleteItemForUser,
  clearCart,
};
