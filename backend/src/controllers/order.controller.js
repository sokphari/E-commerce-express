const orderService = require("../services/order.service");

async function listCustomerOrders(req, res, next) {
  try {
    const result = await orderService.listCustomerOrders(req.user.id, req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function listAdminOrders(req, res, next) {
  try {
    const result = await orderService.listAdminOrders(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function getCustomerOrder(req, res, next) {
  try {
    const order = await orderService.getCustomerOrder(req.user.id, req.validated.params.id);

    res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAdminOrder(req, res, next) {
  try {
    const order = await orderService.getAdminOrder(req.validated.params.id);

    res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function cancelCustomerOrder(req, res, next) {
  try {
    const order = await orderService.cancelCustomerOrder(req.user.id, req.validated.params.id);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateAdminOrderStatus(req, res, next) {
  try {
    const order = await orderService.updateAdminOrderStatus(
      req.validated.params.id,
      req.validated.body.status
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCustomerOrders,
  listAdminOrders,
  getCustomerOrder,
  getAdminOrder,
  cancelCustomerOrder,
  updateAdminOrderStatus,
};
