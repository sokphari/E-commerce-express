const reviewService = require("../services/review.service");

async function listProductReviews(req, res, next) {
  try {
    const result = await reviewService.listProductReviews(
      req.validated.params.productId,
      req.validated.query
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function listAdminReviews(req, res, next) {
  try {
    const result = await reviewService.listAdminReviews(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function createReview(req, res, next) {
  try {
    const review = await reviewService.createReview(
      req.user.id,
      req.validated.params.productId,
      req.validated.body
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: {
        review,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateReview(req, res, next) {
  try {
    const review = await reviewService.updateReview(
      req.user.id,
      req.validated.params.id,
      req.validated.body
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: {
        review,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteReview(req, res, next) {
  try {
    await reviewService.deleteReview(req.user.id, req.validated.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function updateReviewStatus(req, res, next) {
  try {
    const review = await reviewService.updateReviewStatus(
      req.validated.params.id,
      req.validated.body.status
    );

    res.status(200).json({
      success: true,
      message: "Review status updated successfully",
      data: {
        review,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProductReviews,
  listAdminReviews,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
};
