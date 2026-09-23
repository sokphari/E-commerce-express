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
