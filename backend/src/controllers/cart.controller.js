const cartService = require("../services/cart.service");

async function getCart(req, res, next) {
  try {
    const cart = await cartService.getCart(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function addItem(req, res, next) {
  try {
    const cart = await cartService.addItem(req.user.id, req.validated.body);

    res.status(200).json({
      success: true,
      message: "Cart item added successfully",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateItem(req, res, next) {
  try {
    const cart = await cartService.updateItem(
      req.user.id,
      req.validated.params.id,
      req.validated.body
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function removeItem(req, res, next) {
  try {
    const cart = await cartService.removeItem(req.user.id, req.validated.params.id);

    res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function clearCart(req, res, next) {
  try {
    const cart = await cartService.clearCart(req.user.id);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
