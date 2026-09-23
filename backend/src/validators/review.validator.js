const { z } = require("zod");

const reviewStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

const productReviewsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    productId: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

const createReviewSchema = z.object({
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().max(2000).optional(),
  }),
  params: z.object({
    productId: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const updateReviewSchema = z.object({
  body: z
    .object({
      rating: z.coerce.number().int().min(1).max(5).optional(),
      comment: z.string().trim().max(2000).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const reviewIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const listAdminReviewsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    productId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    status: reviewStatusSchema.optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

const updateReviewStatusSchema = z.object({
  body: z.object({
    status: reviewStatusSchema,
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  productReviewsSchema,
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
  listAdminReviewsSchema,
  updateReviewStatusSchema,
};
