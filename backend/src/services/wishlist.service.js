const ApiError = require("../utils/api-error");
const { sanitizeWishlistItem } = require("../utils/wishlist");
const productRepository = require("../repositories/product.repository");
const wishlistRepository = require("../repositories/wishlist.repository");

async function listWishlist(userId) {
  const items = await wishlistRepository.listByUserId(userId);
  return items.map(sanitizeWishlistItem);
}

async function addToWishlist(userId, productId) {
  const product = await productRepository.findById(productId);

  if (!product || product.deleted_at) {
    throw new ApiError(404, "Product not found");
  }

  if (product.status !== "ACTIVE") {
    throw new ApiError(400, "Product is not active");
  }

  const existingItem = await wishlistRepository.findByUserAndProduct(userId, productId);

  if (existingItem) {
    throw new ApiError(409, "Product is already in wishlist");
  }

  const item = await wishlistRepository.add(userId, productId);
  return sanitizeWishlistItem(item);
}

async function removeFromWishlist(userId, productId) {
  const removed = await wishlistRepository.remove(userId, productId);

  if (!removed) {
    throw new ApiError(404, "Wishlist item not found");
  }
}

module.exports = {
  listWishlist,
  addToWishlist,
  removeFromWishlist,
};
