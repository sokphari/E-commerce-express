const { z } = require("zod");

const variantStatusSchema = z.enum(["DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"]);

const listVariantsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    productId: z.string().uuid().optional(),
    status: variantStatusSchema.optional(),
    lowStockOnly: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

const productVariantProductIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    productId: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const productVariantIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const createVariantSchema = z.object({
  body: z.object({
    sku: z.string().trim().min(1).max(100),
    color: z.string().trim().max(80).optional(),
    storage: z.string().trim().max(80).optional(),
    ram: z.string().trim().max(80).optional(),
    price: z.coerce.number().min(0),
    salePrice: z.coerce.number().min(0).optional(),
    stockQuantity: z.coerce.number().int().min(0).optional(),
    lowStockThreshold: z.coerce.number().int().min(0).optional(),
    status: variantStatusSchema.optional(),
    barcode: z.string().trim().max(100).optional(),
    weight: z.coerce.number().min(0).optional(),
    condition: z.string().trim().max(50).optional(),
  }),
  params: z.object({
    productId: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const updateVariantSchema = z.object({
  body: z
    .object({
      sku: z.string().trim().min(1).max(100).optional(),
      color: z.string().trim().max(80).optional(),
      storage: z.string().trim().max(80).optional(),
      ram: z.string().trim().max(80).optional(),
      price: z.coerce.number().min(0).optional(),
      salePrice: z.coerce.number().min(0).optional(),
      stockQuantity: z.coerce.number().int().min(0).optional(),
      lowStockThreshold: z.coerce.number().int().min(0).optional(),
      status: variantStatusSchema.optional(),
      barcode: z.string().trim().max(100).optional(),
      weight: z.coerce.number().min(0).optional(),
      condition: z.string().trim().max(50).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  listVariantsSchema,
  productVariantProductIdSchema,
  productVariantIdSchema,
  createVariantSchema,
  updateVariantSchema,
};
