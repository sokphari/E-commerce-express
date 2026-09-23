const ApiError = require("../utils/api-error");
const { sanitizeAddress } = require("../utils/address");
const { sanitizeOrderDetail, sanitizePayment } = require("../utils/order");
const addressRepository = require("../repositories/address.repository");
const checkoutRepository = require("../repositories/checkout.repository");

async function checkout(userId, input) {
  const address = await addressRepository.findByIdForUser(input.addressId, userId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  try {
    const result = await checkoutRepository.checkout({
      userId,
      address: sanitizeAddress(address),
      paymentMethod: input.paymentMethod,
      notes: input.notes,
    });

    return {
      order: sanitizeOrderDetail({
        order: result.order,
        items: result.items,
        payments: [result.payment],
      }),
      payment: sanitizePayment(result.payment),
    };
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
}

module.exports = {
  checkout,
};
