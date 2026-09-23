const paymentService = require("../services/payment.service");

async function listPayments(req, res, next) {
  try {
    const result = await paymentService.listPayments(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function getPayment(req, res, next) {
  try {
    const payment = await paymentService.getPayment(req.validated.params.id);

    res.status(200).json({
      success: true,
      data: {
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updatePaymentStatus(req, res, next) {
  try {
    const payment = await paymentService.updatePaymentStatus(
      req.validated.params.id,
      req.validated.body.status
    );

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: {
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listPayments,
  getPayment,
  updatePaymentStatus,
};
