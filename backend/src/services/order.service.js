const ApiError = require("../utils/api-error");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const { sanitizeOrder, sanitizeOrderDetail } = require("../utils/order");
const orderRepository = require("../repositories/order.repository");

const adminTransitions = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

async function listCustomerOrders(userId, query) {
  const pagination = getPagination(query);
  const { rows, total } = await orderRepository.listOrders({
    userId,
    status: query.status,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeOrder),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function listAdminOrders(query) {
  const pagination = getPagination(query);
  const { rows, total } = await orderRepository.listOrders({
    status: query.status,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeOrder),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function getCustomerOrder(userId, orderId) {
  const order = await orderRepository.findOrderByIdForUser(orderId, userId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const items = await orderRepository.listItems(order.id);
  const payments = await orderRepository.listPayments(order.id);

  return sanitizeOrderDetail({ order, items, payments });
}

async function getAdminOrder(orderId) {
  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const items = await orderRepository.listItems(order.id);
  const payments = await orderRepository.listPayments(order.id);

  return sanitizeOrderDetail({ order, items, payments });
}

async function cancelCustomerOrder(userId, orderId) {
  const order = await orderRepository.findOrderByIdForUser(orderId, userId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (!["PENDING", "CONFIRMED"].includes(order.order_status)) {
    throw new ApiError(400, "Order cannot be cancelled at this status");
  }

  const updatedOrder = await orderRepository.cancelOrderAndRestoreStock(order.id, userId);
  return sanitizeOrder(updatedOrder);
}

async function updateAdminOrderStatus(orderId, status) {
  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const allowedNextStatuses = adminTransitions[order.order_status] || [];

  if (!allowedNextStatuses.includes(status)) {
    throw new ApiError(400, `Cannot change order from ${order.order_status} to ${status}`);
  }

  const updatedOrder =
    status === "CANCELLED"
      ? await orderRepository.cancelOrderAndRestoreStock(order.id, null)
      : await orderRepository.updateOrderStatus(order.id, status);
  return sanitizeOrder(updatedOrder);
}

module.exports = {
  listCustomerOrders,
  listAdminOrders,
  getCustomerOrder,
  getAdminOrder,
  cancelCustomerOrder,
  updateAdminOrderStatus,
};
