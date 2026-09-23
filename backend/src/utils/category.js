function sanitizeCategory(category) {
  if (!category) return null;

  return {
    id: category.id,
    parentId: category.parent_id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.image_url,
    status: category.status,
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  };
}

module.exports = {
  sanitizeCategory,
};
