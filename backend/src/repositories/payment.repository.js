const pool = require("../config/database");

const paymentSelect = `
  p.id,
  p.order_id,
  p.payment_method,
  p.transaction_reference,
  p.amount,
  p.status,
  p.paid_at,
  p.created_at,
  p.updated_at,
  o.order_number
`;

async function listPayments({ orderId, status, paymentMethod, limit, offset }) {
  const values = [];
  const conditions = [];

  if (orderId) {
    values.push(orderId);
    conditions.push(`p.order_id = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`p.status = $${values.length}`);
  }

  if (paymentMethod) {
    values.push(paymentMethod);
    conditions.push(`p.payment_method = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;
  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query(
    `
      SELECT ${paymentSelect}, COUNT(*) OVER()::int AS total_count
      FROM payments p
      JOIN orders o ON o.id = p.order_id
      ${whereClause}
      ORDER BY p.created_at DESC
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
      SELECT ${paymentSelect}
      FROM payments p
      JOIN orders o ON o.id = p.order_id
      WHERE p.id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function updateStatus(id, status) {
  const result = await pool.query(
    `
      UPDATE payments
      SET
        status = $2::payment_status,
        paid_at = CASE WHEN $2::payment_status = 'PAID' THEN COALESCE(paid_at, NOW()) ELSE paid_at END,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, order_id
    `,
    [id, status]
  );

  if (!result.rows[0]) return null;

  const payment = await findById(result.rows[0].id);
  await pool.query("UPDATE orders SET payment_status = $2::payment_status, updated_at = NOW() WHERE id = $1", [
    result.rows[0].order_id,
    status,
  ]);

  return payment;
}

module.exports = {
  listPayments,
  findById,
  updateStatus,
};
