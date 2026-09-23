function sanitizeBrand(brand) {
  if (!brand) return null;

  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
    logoUrl: brand.logo_url,
    status: brand.status,
    createdAt: brand.created_at,
    updatedAt: brand.updated_at,
  };
}

module.exports = {
  sanitizeBrand,
};
