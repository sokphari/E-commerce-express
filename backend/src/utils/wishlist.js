function sanitizeWishlistItem(item) {
  return {
    id: item.id,
    userId: item.user_id,
    productId: item.product_id,
    createdAt: item.created_at,
    product: {
      id: item.product_id,
      name: item.product_name,
      slug: item.product_slug,
      shortDescription: item.product_short_description,
      basePrice: item.product_base_price,
      status: item.product_status,
      isFeatured: item.product_is_featured,
      deletedAt: item.product_deleted_at,
      brand: item.brand_name
        ? {
            id: item.brand_id,
            name: item.brand_name,
            slug: item.brand_slug,
          }
        : null,
      category: item.category_name
        ? {
            id: item.category_id,
            name: item.category_name,
            slug: item.category_slug,
          }
        : null,
    },
  };
}

module.exports = {
  sanitizeWishlistItem,
};
