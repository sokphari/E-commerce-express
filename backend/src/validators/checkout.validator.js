const { z } = require("zod");

const checkoutSchema = z.object({
  body: z.object({
    addressId: z.string().uuid(),
    paymentMethod: z.enum(["CASH_ON_DELIVERY", "MOCK_CARD", "MOCK_QR"]),
    notes: z.string().trim().max(1000).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  checkoutSchema,
};
