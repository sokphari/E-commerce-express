/**
 * @openapi
 * /api/v1/products/{productId}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: List approved product reviews
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Review list }
 *   post:
 *     tags: [Reviews]
 *     summary: Create product review after delivered purchase
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReviewInput' }
 *     responses:
 *       201: { description: Review submitted }
 * /api/v1/reviews/{id}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update own review
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReviewInput' }
 *     responses:
 *       200: { description: Review updated }
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete own review
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Review deleted }
 */

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
