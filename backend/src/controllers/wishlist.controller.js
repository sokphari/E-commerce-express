const wishlistService = require("../services/wishlist.service");

async function listWishlist(req, res, next) {
  try {
    const wishlist = await wishlistService.listWishlist(req.user.id);

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
}

async function addToWishlist(req, res, next) {
  try {
    const item = await wishlistService.addToWishlist(req.user.id, req.validated.params.productId);

    res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      data: {
        item,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function removeFromWishlist(req, res, next) {
  try {
    await wishlistService.removeFromWishlist(req.user.id, req.validated.params.productId);

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listWishlist,
  addToWishlist,
  removeFromWishlist,
};
