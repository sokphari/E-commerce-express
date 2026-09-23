const { z } = require("zod");

const addressIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const createAddressSchema = z.object({
  body: z.object({
    recipientName: z.string().trim().min(1).max(150),
    phone: z.string().trim().min(1).max(30),
    addressLine: z.string().trim().min(1).max(1000),
    city: z.string().trim().min(1).max(100),
    province: z.string().trim().max(100).optional(),
    postalCode: z.string().trim().max(30).optional(),
    country: z.string().trim().min(1).max(100).optional(),
    isDefault: z.boolean().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateAddressSchema = z.object({
  body: z
    .object({
      recipientName: z.string().trim().min(1).max(150).optional(),
      phone: z.string().trim().min(1).max(30).optional(),
      addressLine: z.string().trim().min(1).max(1000).optional(),
      city: z.string().trim().min(1).max(100).optional(),
      province: z.string().trim().max(100).optional(),
      postalCode: z.string().trim().max(30).optional(),
      country: z.string().trim().min(1).max(100).optional(),
      isDefault: z.boolean().optional(),
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
  addressIdSchema,
  createAddressSchema,
  updateAddressSchema,
};
