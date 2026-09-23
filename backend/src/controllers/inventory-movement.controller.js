const inventoryMovementService = require("../services/inventory-movement.service");

async function listMovements(req, res, next) {
  try {
    const result = await inventoryMovementService.listMovements(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function listVariantMovements(req, res, next) {
  try {
    const result = await inventoryMovementService.listVariantMovements(
      req.validated.params.variantId,
      req.validated.query
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listMovements,
  listVariantMovements,
};
