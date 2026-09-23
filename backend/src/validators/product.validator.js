const { z } = require("zod");

const productStatusSchema = z.enum(["DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"]);
const sortSchema = z.enum(["newest", "price_asc", "price_desc", "name_asc", "name_desc"]);

const listProductsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    search: z.string().trim().max(100).optional(),
    brandId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    status: productStatusSchema.optional(),
    isFeatured: z.coerce.boolean().optional(),
    sort: sortSchema.optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

const productSlugSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    slug: z.string().trim().min(1).max(220),
  }),
  query: z.object({}).optional(),
});

const productIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const createProductSchema = z.object({
  body: z.object({
    brandId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(220).optional(),
    shortDescription: z.string().trim().max(1000).optional(),
    description: z.string().trim().max(10000).optional(),
    basePrice: z.coerce.number().min(0),
    status: productStatusSchema.optional(),
    isFeatured: z.boolean().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateProductSchema = z.object({
  body: z
    .object({
      brandId: z.string().uuid().optional(),
      categoryId: z.string().uuid().optional(),
      name: z.string().trim().min(1).max(200).optional(),
      slug: z.string().trim().min(1).max(220).optional(),
      shortDescription: z.string().trim().max(1000).optional(),
      description: z.string().trim().max(10000).optional(),
      basePrice: z.coerce.number().min(0).optional(),
      status: productStatusSchema.optional(),
      isFeatured: z.boolean().optional(),
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
  listProductsSchema,
  productSlugSchema,
  productIdSchema,
  createProductSchema,
  updateProductSchema,
};
