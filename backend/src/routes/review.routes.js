const express = require("express");
const reviewController = require("../controllers/review.controller");
const { authenticate } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  productReviewsSchema,
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
} = require("../validators/review.validator");

const router = express.Router();

router.get("/products/:productId/reviews", validate(productReviewsSchema), reviewController.listProductReviews);
router.post(
  "/products/:productId/reviews",
  authenticate,
  validate(createReviewSchema),
  reviewController.createReview
);
router.patch("/reviews/:id", authenticate, validate(updateReviewSchema), reviewController.updateReview);
router.delete("/reviews/:id", authenticate, validate(reviewIdSchema), reviewController.deleteReview);

module.exports = router;
