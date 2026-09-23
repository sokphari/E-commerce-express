const { z } = require("zod");

const statusSchema = z.enum(["ACTIVE", "INACTIVE"]);

const listBrandsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    search: z.string().trim().max(100).optional(),
    status: statusSchema.optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

const brandSlugSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    slug: z.string().trim().min(1).max(180),
  }),
  query: z.object({}).optional(),
});

const brandIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const createBrandSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(150),
    slug: z.string().trim().min(1).max(180).optional(),
    description: z.string().trim().max(1000).optional(),
    logoUrl: z.string().trim().url().max(1000).optional(),
    status: statusSchema.optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateBrandSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(150).optional(),
      slug: z.string().trim().min(1).max(180).optional(),
      description: z.string().trim().max(1000).optional(),
      logoUrl: z.string().trim().url().max(1000).optional(),
      status: statusSchema.optional(),
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
  listBrandsSchema,
  brandSlugSchema,
  brandIdSchema,
  createBrandSchema,
  updateBrandSchema,
};
