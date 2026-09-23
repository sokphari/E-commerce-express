const { z } = require("zod");

const cartItemIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const addCartItemSchema = z.object({
  body: z.object({
    productVariantId: z.string().uuid(),
    quantity: z.coerce.number().int().positive(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.coerce.number().int().positive(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  cartItemIdSchema,
  addCartItemSchema,
  updateCartItemSchema,
};
