function sanitizeProductVariant(variant) {
  if (!variant) return null;

  return {
    id: variant.id,
    productId: variant.product_id,
    sku: variant.sku,
    color: variant.color,
    storage: variant.storage,
    ram: variant.ram,
    price: variant.price,
    salePrice: variant.sale_price,
    stockQuantity: variant.stock_quantity,
    lowStockThreshold: variant.low_stock_threshold,
    status: variant.status,
    barcode: variant.barcode,
    weight: variant.weight,
    condition: variant.condition,
    createdAt: variant.created_at,
    updatedAt: variant.updated_at,
    product: variant.product_name
      ? {
          id: variant.product_id,
          name: variant.product_name,
          slug: variant.product_slug,
          status: variant.product_status,
        }
      : null,
  };
}

module.exports = {
  sanitizeProductVariant,
};
