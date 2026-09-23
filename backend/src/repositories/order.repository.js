const pool = require("../config/database");

const orderSelect = `
  id,
  user_id,
  order_number,
  shipping_address_snapshot,
  subtotal,
  discount_amount,
  shipping_fee,
  tax_amount,
  total_amount,
  payment_status,
  order_status,
  notes,
  created_at,
  updated_at
`;

const orderItemSelect = `
  id,
  order_id,
  product_id,
  product_variant_id,
  product_name,
  sku,
  variant_description,
  unit_price,
  quantity,
  line_total
`;

const paymentSelect = `
  id,
  order_id,
  payment_method,
  transaction_reference,
  amount,
  status,
  paid_at,
  created_at,
  updated_at
`;

async function listOrders({ userId, status, limit, offset }) {
  const values = [];
  const conditions = [];

  if (userId) {
    values.push(userId);
    conditions.push(`user_id = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`order_status = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;
  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query(
    `
      SELECT ${orderSelect}, COUNT(*) OVER()::int AS total_count
      FROM orders
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

async function findOrderById(id) {
  const result = await pool.query(`SELECT ${orderSelect} FROM orders WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function findOrderByIdForUser(id, userId) {
  const result = await pool.query(
    `SELECT ${orderSelect} FROM orders WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0] || null;
}

async function listItems(orderId) {
  const result = await pool.query(
    `SELECT ${orderItemSelect} FROM order_items WHERE order_id = $1 ORDER BY id`,
    [orderId]
  );
  return result.rows;
}

async function listPayments(orderId) {
  const result = await pool.query(
    `SELECT ${paymentSelect} FROM payments WHERE order_id = $1 ORDER BY created_at DESC`,
    [orderId]
  );
  return result.rows;
}

async function updateOrderStatus(id, status) {
  const result = await pool.query(
    `
      UPDATE orders
      SET order_status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING ${orderSelect}
    `,
    [id, status]
  );
  return result.rows[0] || null;
}

async function updatePaymentStatus(id, status) {
  const result = await pool.query(
    `
      UPDATE orders
      SET payment_status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING ${orderSelect}
    `,
    [id, status]
  );
  return result.rows[0] || null;
}

async function cancelOrderAndRestoreStock(orderId, createdBy) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      `
        UPDATE orders
        SET order_status = 'CANCELLED', updated_at = NOW()
        WHERE id = $1
        RETURNING ${orderSelect}
      `,
      [orderId]
    );

    const order = orderResult.rows[0] || null;

    if (!order) {
      await client.query("ROLLBACK");
      return null;
    }

    const itemResult = await client.query(
      `
        SELECT ${orderItemSelect}
        FROM order_items
        WHERE order_id = $1
      `,
      [orderId]
    );

    for (const item of itemResult.rows) {
      if (!item.product_variant_id) continue;

      await client.query(
        `
          UPDATE product_variants
          SET stock_quantity = stock_quantity + $2, updated_at = NOW()
          WHERE id = $1
        `,
        [item.product_variant_id, item.quantity]
      );

      await client.query(
        `
          INSERT INTO inventory_movements (
            product_variant_id,
            type,
            quantity,
            reference_type,
            reference_id,
            note,
            created_by
          )
          VALUES ($1, 'ORDER_CANCEL', $2, 'ORDER', $3, $4, $5)
        `,
        [
          item.product_variant_id,
          item.quantity,
          orderId,
          `Cancelled order ${order.order_number}`,
          createdBy,
        ]
      );
    }

    await client.query("COMMIT");
    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  listOrders,
  findOrderById,
  findOrderByIdForUser,
  listItems,
  listPayments,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrderAndRestoreStock,
};
