const { z } = require("zod");

const statusSchema = z.enum(["ACTIVE", "INACTIVE"]);
const parentIdSchema = z.union([z.string().uuid(), z.literal("root")]);

const listCategoriesSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    search: z.string().trim().max(100).optional(),
    status: statusSchema.optional(),
    parentId: parentIdSchema.optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

const categorySlugSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    slug: z.string().trim().min(1).max(180),
  }),
  query: z.object({}).optional(),
});

const categoryIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const createCategorySchema = z.object({
  body: z.object({
    parentId: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(150),
    slug: z.string().trim().min(1).max(180).optional(),
    description: z.string().trim().max(1000).optional(),
    imageUrl: z.string().trim().url().max(1000).optional(),
    status: statusSchema.optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateCategorySchema = z.object({
  body: z
    .object({
      parentId: z.string().uuid().optional(),
      name: z.string().trim().min(1).max(150).optional(),
      slug: z.string().trim().min(1).max(180).optional(),
      description: z.string().trim().max(1000).optional(),
      imageUrl: z.string().trim().url().max(1000).optional(),
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
  listCategoriesSchema,
  categorySlugSchema,
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
};
