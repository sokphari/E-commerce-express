function sanitizeOrder(order) {
  if (!order) return null;

  return {
    id: order.id,
    userId: order.user_id,
    orderNumber: order.order_number,
    shippingAddressSnapshot: order.shipping_address_snapshot,
    subtotal: order.subtotal,
    discountAmount: order.discount_amount,
    shippingFee: order.shipping_fee,
    taxAmount: order.tax_amount,
    totalAmount: order.total_amount,
    paymentStatus: order.payment_status,
    orderStatus: order.order_status,
    notes: order.notes,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
}

function sanitizeOrderItem(item) {
  return {
    id: item.id,
    orderId: item.order_id,
    productId: item.product_id,
    productVariantId: item.product_variant_id,
    productName: item.product_name,
    sku: item.sku,
    variantDescription: item.variant_description,
    unitPrice: item.unit_price,
    quantity: item.quantity,
    lineTotal: item.line_total,
  };
}

function sanitizePayment(payment) {
  if (!payment) return null;

  return {
    id: payment.id,
    orderId: payment.order_id,
    paymentMethod: payment.payment_method,
    transactionReference: payment.transaction_reference,
    amount: payment.amount,
    status: payment.status,
    paidAt: payment.paid_at,
    createdAt: payment.created_at,
    updatedAt: payment.updated_at,
  };
}

function sanitizeOrderDetail({ order, items = [], payments = [] }) {
  return {
    ...sanitizeOrder(order),
    items: items.map(sanitizeOrderItem),
    payments: payments.map(sanitizePayment),
  };
}

module.exports = {
  sanitizeOrder,
  sanitizeOrderItem,
  sanitizePayment,
  sanitizeOrderDetail,
};
