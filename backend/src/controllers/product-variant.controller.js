const variantService = require("../services/product-variant.service");

async function listAdminVariants(req, res, next) {
  try {
    const result = await variantService.listAdminVariants(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function listProductVariants(req, res, next) {
  try {
    const result = await variantService.listProductVariants(
      req.validated.params.productId,
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

async function createVariant(req, res, next) {
  try {
    const variant = await variantService.createVariant(
      req.validated.params.productId,
      req.validated.body
    );

    res.status(201).json({
      success: true,
      message: "Product variant created successfully",
      data: {
        variant,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateVariant(req, res, next) {
  try {
    const variant = await variantService.updateVariant(req.validated.params.id, req.validated.body);

    res.status(200).json({
      success: true,
      message: "Product variant updated successfully",
      data: {
        variant,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function archiveVariant(req, res, next) {
  try {
    const variant = await variantService.archiveVariant(req.validated.params.id);

    res.status(200).json({
      success: true,
      message: "Product variant archived successfully",
      data: {
        variant,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listAdminVariants,
  listProductVariants,
  createVariant,
  updateVariant,
  archiveVariant,
};
