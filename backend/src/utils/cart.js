function getVariantPrice(item) {
  return Number(item.sale_price || item.price);
}

function sanitizeCartItem(item) {
  const unitPrice = getVariantPrice(item);
  const quantity = Number(item.quantity);

  return {
    id: item.id,
    cartId: item.cart_id,
    productVariantId: item.product_variant_id,
    quantity,
    unitPrice: unitPrice.toFixed(2),
    lineTotal: (unitPrice * quantity).toFixed(2),
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    variant: {
      id: item.product_variant_id,
      sku: item.sku,
      color: item.color,
      storage: item.storage,
      ram: item.ram,
      price: item.price,
      salePrice: item.sale_price,
      stockQuantity: item.stock_quantity,
      status: item.variant_status,
    },
    product: {
      id: item.product_id,
      name: item.product_name,
      slug: item.product_slug,
      status: item.product_status,
    },
  };
}

function sanitizeCart(cart, items) {
  const sanitizedItems = items.map(sanitizeCartItem);
  const subtotal = sanitizedItems.reduce((sum, item) => sum + Number(item.lineTotal), 0);

  return {
    id: cart.id,
    userId: cart.user_id,
    items: sanitizedItems,
    summary: {
      itemCount: sanitizedItems.length,
      totalQuantity: sanitizedItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: subtotal.toFixed(2),
    },
    createdAt: cart.created_at,
    updatedAt: cart.updated_at,
  };
}

module.exports = {
  sanitizeCart,
  sanitizeCartItem,
};
