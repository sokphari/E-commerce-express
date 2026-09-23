const ApiError = require("../utils/api-error");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const { sanitizePayment } = require("../utils/order");
const paymentRepository = require("../repositories/payment.repository");

function enrichPayment(payment) {
  const sanitized = sanitizePayment(payment);
  if (!sanitized) return null;

  return {
    ...sanitized,
    orderNumber: payment.order_number,
  };
}

async function listPayments(query) {
  const pagination = getPagination(query);
  const { rows, total } = await paymentRepository.listPayments({
    orderId: query.orderId,
    status: query.status,
    paymentMethod: query.paymentMethod,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(enrichPayment),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function getPayment(id) {
  const payment = await paymentRepository.findById(id);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return enrichPayment(payment);
}

async function updatePaymentStatus(id, status) {
  const payment = await paymentRepository.updateStatus(id, status);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return enrichPayment(payment);
}

module.exports = {
  listPayments,
  getPayment,
  updatePaymentStatus,
};
