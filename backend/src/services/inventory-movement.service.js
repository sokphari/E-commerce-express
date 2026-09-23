const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const { sanitizeInventoryMovement } = require("../utils/inventory-movement");
const inventoryMovementRepository = require("../repositories/inventory-movement.repository");

async function listMovements(query) {
  const pagination = getPagination(query);
  const { rows, total } = await inventoryMovementRepository.listMovements({
    productVariantId: query.productVariantId,
    type: query.type,
    referenceType: query.referenceType,
    referenceId: query.referenceId,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows.map(sanitizeInventoryMovement),
    pagination: buildPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
}

async function listVariantMovements(variantId, query) {
  return listMovements({
    ...query,
    productVariantId: variantId,
  });
}

module.exports = {
  listMovements,
  listVariantMovements,
};
