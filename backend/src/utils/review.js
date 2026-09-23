function sanitizeReview(review) {
  if (!review) return null;

  return {
    id: review.id,
    userId: review.user_id,
    productId: review.product_id,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.created_at,
    updatedAt: review.updated_at,
    user: review.first_name
      ? {
          id: review.user_id,
          firstName: review.first_name,
          lastName: review.last_name,
        }
      : null,
    product: review.product_name
      ? {
          id: review.product_id,
          name: review.product_name,
          slug: review.product_slug,
        }
      : null,
  };
}

module.exports = {
  sanitizeReview,
};
