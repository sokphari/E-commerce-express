const ApiError = require("../utils/api-error");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const { sanitizeReview } = require("../utils/review");
const productRepository = require("../repositories/product.repository");
const reviewRepository = require("../repositories/review.repository");

async function ensureActiveProduct(productId) {
  const product = await productRepository.findById(productId);

  if (!product || product.deleted_at) {
    throw new ApiError(404, "Product not found");
  }

  if (product.status !== "ACTIVE") {
    throw new ApiError(400, "Product is not active");
  }

  return product;
}

async function listProductReviews(productId, query) {
  await ensureActiveProduct(productId);

  const pagination = getPagination(query);
  const { rows, total } = await reviewRepository.listReviews({
    productId,
    status: "APPROVED",
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeReview),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function listAdminReviews(query) {
  const pagination = getPagination(query);
  const { rows, total } = await reviewRepository.listReviews({
    productId: query.productId,
    userId: query.userId,
    status: query.status,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeReview),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function createReview(userId, productId, input) {
  await ensureActiveProduct(productId);

  const existingReview = await reviewRepository.findByUserAndProduct(userId, productId);

  if (existingReview) {
    throw new ApiError(409, "You already reviewed this product");
  }

  const hasPurchased = await reviewRepository.hasDeliveredPurchase(userId, productId);

  if (!hasPurchased) {
    throw new ApiError(403, "You can review this product after it has been delivered");
  }

  const review = await reviewRepository.createReview({
    userId,
    productId,
    rating: input.rating,
    comment: input.comment,
  });

  return sanitizeReview(review);
}

async function updateReview(userId, reviewId, input) {
  const review = await reviewRepository.findById(reviewId);

  if (!review || review.user_id !== userId) {
    throw new ApiError(404, "Review not found");
  }

  const updatedReview = await reviewRepository.updateReview(reviewId, input);
  return sanitizeReview(updatedReview);
}

async function deleteReview(userId, reviewId) {
  const review = await reviewRepository.findById(reviewId);

  if (!review || review.user_id !== userId) {
    throw new ApiError(404, "Review not found");
  }

  await reviewRepository.deleteReview(reviewId);
}

async function updateReviewStatus(reviewId, status) {
  const review = await reviewRepository.updateStatus(reviewId, status);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  return sanitizeReview(review);
}

module.exports = {
  listProductReviews,
  listAdminReviews,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
};
