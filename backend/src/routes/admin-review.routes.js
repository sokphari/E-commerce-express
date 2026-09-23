/**
 * @openapi
 * /api/v1/admin/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Admin list reviews
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Review list }
 * /api/v1/admin/reviews/{id}/status:
 *   patch:
 *     tags: [Reviews]
 *     summary: Admin update review moderation status
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *                 example: APPROVED
 *     responses:
 *       200: { description: Review status updated }
 */

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
