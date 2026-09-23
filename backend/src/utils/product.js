function sanitizeProduct(product) {
  if (!product) return null;

  return {
    id: product.id,
    brandId: product.brand_id,
    categoryId: product.category_id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.short_description,
    description: product.description,
    basePrice: product.base_price,
    status: product.status,
    isFeatured: product.is_featured,
    deletedAt: product.deleted_at,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    brand: product.brand_name
      ? {
          id: product.brand_id,
          name: product.brand_name,
          slug: product.brand_slug,
        }
      : null,
    category: product.category_name
      ? {
          id: product.category_id,
          name: product.category_name,
          slug: product.category_slug,
        }
      : null,
  };
}

module.exports = {
  sanitizeProduct,
};
