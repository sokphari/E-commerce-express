const checkoutService = require("../services/checkout.service");

async function checkout(req, res, next) {
  try {
    const result = await checkoutService.checkout(req.user.id, req.validated.body);

    res.status(201).json({
      success: true,
      message: "Checkout completed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkout,
};
