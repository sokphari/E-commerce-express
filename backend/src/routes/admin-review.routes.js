const express = require("express");
const reviewController = require("../controllers/review.controller");
const validate = require("../middleware/validate.middleware");
const {
  listAdminReviewsSchema,
  updateReviewStatusSchema,
} = require("../validators/review.validator");

const router = express.Router();

router.get("/", validate(listAdminReviewsSchema), reviewController.listAdminReviews);
router.patch("/:id/status", validate(updateReviewStatusSchema), reviewController.updateReviewStatus);

module.exports = router;
