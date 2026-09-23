function sanitizeInventoryMovement(movement) {
  if (!movement) return null;

  return {
    id: movement.id,
    productVariantId: movement.product_variant_id,
    type: movement.type,
    quantity: movement.quantity,
    referenceType: movement.reference_type,
    referenceId: movement.reference_id,
    note: movement.note,
    createdBy: movement.created_by,
    createdAt: movement.created_at,
    variant: movement.sku
      ? {
          id: movement.product_variant_id,
          sku: movement.sku,
          color: movement.color,
          storage: movement.storage,
          ram: movement.ram,
        }
      : null,
    product: movement.product_name
      ? {
          id: movement.product_id,
          name: movement.product_name,
          slug: movement.product_slug,
        }
      : null,
  };
}

module.exports = {
  sanitizeInventoryMovement,
};
