const pool = require("../config/database");

function buildOrderNumber() {
  const date = new Date();
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PH-${yyyymmdd}-${random}`;
}

function getEffectivePrice(row) {
  return Number(row.sale_price || row.price);
}

function buildVariantDescription(row) {
  return [row.color, row.storage, row.ram].filter(Boolean).join(" / ") || null;
}

async function checkout({ userId, address, paymentMethod, notes }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cartResult = await client.query("SELECT id FROM carts WHERE user_id = $1", [userId]);
    const cart = cartResult.rows[0];

    if (!cart) {
      const error = new Error("Cart is empty");
      error.statusCode = 400;
      throw error;
    }

    const itemResult = await client.query(
      `
        SELECT
          ci.id AS cart_item_id,
          ci.quantity,
          v.id AS product_variant_id,
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
          p.status AS product_status
        FROM cart_items ci
        JOIN product_variants v ON v.id = ci.product_variant_id
        JOIN products p ON p.id = v.product_id
        WHERE ci.cart_id = $1
        ORDER BY ci.created_at
        FOR UPDATE OF v
      `,
      [cart.id]
    );

    const items = itemResult.rows;

    if (items.length === 0) {
      const error = new Error("Cart is empty");
      error.statusCode = 400;
      throw error;
    }

    let subtotal = 0;

    for (const item of items) {
      if (item.product_status !== "ACTIVE") {
        const error = new Error(`Product is not active: ${item.product_name}`);
        error.statusCode = 400;
        throw error;
      }

      if (item.variant_status !== "ACTIVE") {
        const error = new Error(`Product variant is not active: ${item.sku}`);
        error.statusCode = 400;
        throw error;
      }

      if (item.quantity > item.stock_quantity) {
        const error = new Error(`Insufficient stock for SKU ${item.sku}`);
        error.statusCode = 400;
        throw error;
      }

      subtotal += getEffectivePrice(item) * Number(item.quantity);
    }

    const discountAmount = 0;
    const shippingFee = 0;
    const taxAmount = 0;
    const totalAmount = subtotal - discountAmount + shippingFee + taxAmount;
    const paymentStatus = paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PAID";
    const orderNumber = buildOrderNumber();

    const orderResult = await client.query(
      `
        INSERT INTO orders (
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
          notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', $10)
        RETURNING *
      `,
      [
        userId,
        orderNumber,
        JSON.stringify(address),
        subtotal.toFixed(2),
        discountAmount.toFixed(2),
        shippingFee.toFixed(2),
        taxAmount.toFixed(2),
        totalAmount.toFixed(2),
        paymentStatus,
        notes || null,
      ]
    );

    const order = orderResult.rows[0];
    const orderItems = [];

    for (const item of items) {
      const unitPrice = getEffectivePrice(item);
      const lineTotal = unitPrice * Number(item.quantity);

      const orderItemResult = await client.query(
        `
          INSERT INTO order_items (
            order_id,
            product_id,
            product_variant_id,
            product_name,
            sku,
            variant_description,
            unit_price,
            quantity,
            line_total
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `,
        [
          order.id,
          item.product_id,
          item.product_variant_id,
          item.product_name,
          item.sku,
          buildVariantDescription(item),
          unitPrice.toFixed(2),
          item.quantity,
          lineTotal.toFixed(2),
        ]
      );

      orderItems.push(orderItemResult.rows[0]);

      await client.query(
        `
          UPDATE product_variants
          SET stock_quantity = stock_quantity - $2, updated_at = NOW()
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
          VALUES ($1, 'SALE', $2, 'ORDER', $3, $4, $5)
        `,
        [
          item.product_variant_id,
          item.quantity,
          order.id,
          `Order ${order.order_number}`,
          userId,
        ]
      );
    }

    const paymentResult = await client.query(
      `
        INSERT INTO payments (
          order_id,
          payment_method,
          transaction_reference,
          amount,
          status,
          paid_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        order.id,
        paymentMethod,
        `${paymentMethod}-${order.order_number}`,
        totalAmount.toFixed(2),
        paymentStatus,
        paymentStatus === "PAID" ? new Date() : null,
      ]
    );

    await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cart.id]);

    await client.query("COMMIT");

    return {
      order,
      items: orderItems,
      payment: paymentResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  checkout,
};
