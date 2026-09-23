const { z } = require("zod");

const paymentStatusSchema = z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]);

const paymentIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const listPaymentsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    orderId: z.string().uuid().optional(),
    status: paymentStatusSchema.optional(),
    paymentMethod: z.string().trim().max(80).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

const updatePaymentStatusSchema = z.object({
  body: z.object({
    status: paymentStatusSchema,
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  paymentIdSchema,
  listPaymentsSchema,
  updatePaymentStatusSchema,
};
