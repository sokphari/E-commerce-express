const brandService = require("../services/brand.service");

async function listBrands(req, res, next) {
  try {
    const result = await brandService.listBrands(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function listAdminBrands(req, res, next) {
  try {
    const result = await brandService.listAdminBrands(req.validated.query);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function getBrandBySlug(req, res, next) {
  try {
    const brand = await brandService.getBrandBySlug(req.validated.params.slug);

    res.status(200).json({
      success: true,
      data: {
        brand,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function createBrand(req, res, next) {
  try {
    const brand = await brandService.createBrand(req.validated.body);

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: {
        brand,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateBrand(req, res, next) {
  try {
    const brand = await brandService.updateBrand(req.validated.params.id, req.validated.body);

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: {
        brand,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function archiveBrand(req, res, next) {
  try {
    const brand = await brandService.archiveBrand(req.validated.params.id);

    res.status(200).json({
      success: true,
      message: "Brand archived successfully",
      data: {
        brand,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listBrands,
  listAdminBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  archiveBrand,
};
