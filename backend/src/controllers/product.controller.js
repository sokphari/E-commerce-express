const productService = require("../services/product.service");

async function listProducts(req, res, next) {
  try {
    const result = await productService.listProducts(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function listAdminProducts(req, res, next) {
  try {
    const result = await productService.listAdminProducts(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await productService.getProductBySlug(req.validated.params.slug);

    res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.validated.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(req.validated.params.id, req.validated.body);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function archiveProduct(req, res, next) {
  try {
    const product = await productService.archiveProduct(req.validated.params.id);

    res.status(200).json({
      success: true,
      message: "Product archived successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  listAdminProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  archiveProduct,
};
