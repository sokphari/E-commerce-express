function sanitizeAddress(address) {
  if (!address) return null;

  return {
    id: address.id,
    userId: address.user_id,
    recipientName: address.recipient_name,
    phone: address.phone,
    addressLine: address.address_line,
    city: address.city,
    province: address.province,
    postalCode: address.postal_code,
    country: address.country,
    isDefault: address.is_default,
    createdAt: address.created_at,
    updatedAt: address.updated_at,
  };
}

module.exports = {
  sanitizeAddress,
};
