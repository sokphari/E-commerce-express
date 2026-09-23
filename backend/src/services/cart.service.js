const ApiError = require("../utils/api-error");
const { sanitizeCart } = require("../utils/cart");
const cartRepository = require("../repositories/cart.repository");
const variantRepository = require("../repositories/product-variant.repository");

function ensureVariantCanBePurchased(variant) {
  if (!variant) {
    throw new ApiError(404, "Product variant not found");
  }

  if (variant.product_status !== "ACTIVE") {
    throw new ApiError(400, "Product is not active");
  }

  if (variant.status !== "ACTIVE") {
    throw new ApiError(400, "Product variant is not active");
  }
}

function ensureStockAvailable(variant, quantity) {
  if (quantity > variant.stock_quantity) {
    throw new ApiError(400, "Quantity cannot exceed available stock");
  }
}

async function getCart(userId) {
  const cart = await cartRepository.getOrCreateCart(userId);
  const items = await cartRepository.listItems(cart.id);

  return sanitizeCart(cart, items);
}

async function addItem(userId, input) {
  const variant = await variantRepository.findById(input.productVariantId);
  ensureVariantCanBePurchased(variant);

  const cart = await cartRepository.getOrCreateCart(userId);
  const existingItem = await cartRepository.findItemByVariant(cart.id, input.productVariantId);
  const nextQuantity = existingItem
    ? Number(existingItem.quantity) + input.quantity
    : input.quantity;

  ensureStockAvailable(variant, nextQuantity);

  if (existingItem) {
    await cartRepository.updateItemQuantity(existingItem.id, nextQuantity);
  } else {
    await cartRepository.addItem(cart.id, input.productVariantId, input.quantity);
  }

  return getCart(userId);
}

async function updateItem(userId, itemId, input) {
  const item = await cartRepository.findItemByIdForUser(itemId, userId);

  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }

  const variant = await variantRepository.findById(item.product_variant_id);
  ensureVariantCanBePurchased(variant);
  ensureStockAvailable(variant, input.quantity);

  await cartRepository.updateItemQuantity(itemId, input.quantity);
  return getCart(userId);
}

async function removeItem(userId, itemId) {
  const deleted = await cartRepository.deleteItemForUser(itemId, userId);

  if (!deleted) {
    throw new ApiError(404, "Cart item not found");
  }

  return getCart(userId);
}

async function clearCart(userId) {
  const cart = await cartRepository.getOrCreateCart(userId);
  await cartRepository.clearCart(cart.id);

  return getCart(userId);
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
