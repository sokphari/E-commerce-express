const { z } = require("zod");

const wishlistProductIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    productId: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  wishlistProductIdSchema,
};
