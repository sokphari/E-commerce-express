const { z } = require("zod");

const movementTypeSchema = z.enum(["STOCK_IN", "SALE", "ORDER_CANCEL", "RETURN", "ADJUSTMENT"]);

const listInventoryMovementsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    productVariantId: z.string().uuid().optional(),
    type: movementTypeSchema.optional(),
    referenceType: z.string().trim().max(80).optional(),
    referenceId: z.string().uuid().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

const variantMovementSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    variantId: z.string().uuid(),
  }),
  query: z.object({
    type: movementTypeSchema.optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

module.exports = {
  listInventoryMovementsSchema,
  variantMovementSchema,
};
