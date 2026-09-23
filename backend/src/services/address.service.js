const ApiError = require("../utils/api-error");
const { sanitizeAddress } = require("../utils/address");
const addressRepository = require("../repositories/address.repository");

async function listAddresses(userId) {
  const addresses = await addressRepository.listByUserId(userId);
  return addresses.map(sanitizeAddress);
}

async function createAddress(userId, input) {
  const hasExistingAddress = await addressRepository.hasAnyForUser(userId);

  const address = await addressRepository.createAddress(userId, {
    ...input,
    isDefault: input.isDefault || !hasExistingAddress,
  });

  return sanitizeAddress(address);
}

async function updateAddress(userId, addressId, input) {
  const address = await addressRepository.updateAddress(addressId, userId, input);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return sanitizeAddress(address);
}

async function setDefaultAddress(userId, addressId) {
  const existingAddress = await addressRepository.findByIdForUser(addressId, userId);

  if (!existingAddress) {
    throw new ApiError(404, "Address not found");
  }

  const address = await addressRepository.setDefault(addressId, userId);
  return sanitizeAddress(address);
}

async function deleteAddress(userId, addressId) {
  const address = await addressRepository.deleteAddress(addressId, userId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return sanitizeAddress(address);
}

module.exports = {
  listAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
};
