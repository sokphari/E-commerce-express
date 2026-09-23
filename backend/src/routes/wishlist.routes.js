/**
 * @openapi
 * /api/v1/wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: List customer wishlist
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Wishlist list }
 * /api/v1/wishlist/{productId}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add product to wishlist
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       201: { description: Added to wishlist }
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove product from wishlist
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Removed from wishlist }
 */

const express = require("express");
const wishlistController = require("../controllers/wishlist.controller");
const { authenticate } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { wishlistProductIdSchema } = require("../validators/wishlist.validator");

const router = express.Router();

router.use(authenticate);

router.get("/", wishlistController.listWishlist);
router.post("/:productId", validate(wishlistProductIdSchema), wishlistController.addToWishlist);
router.delete("/:productId", validate(wishlistProductIdSchema), wishlistController.removeFromWishlist);

module.exports = router;
