const addressService = require("../services/address.service");

async function listAddresses(req, res, next) {
  try {
    const addresses = await addressService.listAddresses(req.user.id);

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
}

async function createAddress(req, res, next) {
  try {
    const address = await addressService.createAddress(req.user.id, req.validated.body);

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateAddress(req, res, next) {
  try {
    const address = await addressService.updateAddress(
      req.user.id,
      req.validated.params.id,
      req.validated.body
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function setDefaultAddress(req, res, next) {
  try {
    const address = await addressService.setDefaultAddress(req.user.id, req.validated.params.id);

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const address = await addressService.deleteAddress(req.user.id, req.validated.params.id);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
};
