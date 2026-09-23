const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PhoneHub API",
      version: "1.0.0",
      description: "REST API for PhoneHub phone and accessories e-commerce backend.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Request successful" },
            data: { type: "object" },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            total: { type: "integer", example: 100 },
            totalPages: { type: "integer", example: 5 },
          },
        },
        RegisterInput: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: { type: "string", example: "Sok" },
            lastName: { type: "string", example: "Phari" },
            email: { type: "string", example: "customer@example.com" },
            phone: { type: "string", example: "012345678" },
            password: { type: "string", example: "Password123" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "customer@example.com" },
            password: { type: "string", example: "Password123" },
          },
        },
        RefreshInput: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" },
          },
        },
        BrandInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Apple" },
            slug: { type: "string", example: "apple" },
            description: { type: "string", example: "Apple devices and accessories." },
            logoUrl: { type: "string", example: "https://example.com/apple.png" },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"], example: "ACTIVE" },
          },
        },
        CategoryInput: {
          type: "object",
          required: ["name"],
          properties: {
            parentId: { type: "string", format: "uuid" },
            name: { type: "string", example: "Phones" },
            slug: { type: "string", example: "phones" },
            description: { type: "string", example: "Smartphones and mobile devices." },
            imageUrl: { type: "string", example: "https://example.com/phones.png" },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"], example: "ACTIVE" },
          },
        },
        ProductInput: {
          type: "object",
          required: ["name", "basePrice"],
          properties: {
            brandId: { type: "string", format: "uuid" },
            categoryId: { type: "string", format: "uuid" },
            name: { type: "string", example: "iPhone 15" },
            slug: { type: "string", example: "iphone-15" },
            shortDescription: { type: "string", example: "Apple smartphone with A16 Bionic chip." },
            description: { type: "string", example: "The iPhone 15 features USB-C and improved cameras." },
            basePrice: { type: "number", example: 799 },
            status: { type: "string", enum: ["DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"], example: "ACTIVE" },
            isFeatured: { type: "boolean", example: true },
          },
        },
        VariantInput: {
          type: "object",
          required: ["sku", "price"],
          properties: {
            sku: { type: "string", example: "IPH15-128-BLK" },
            color: { type: "string", example: "Black" },
            storage: { type: "string", example: "128GB" },
            ram: { type: "string", example: "6GB" },
            price: { type: "number", example: 799 },
            salePrice: { type: "number", example: 749 },
            stockQuantity: { type: "integer", example: 10 },
            lowStockThreshold: { type: "integer", example: 3 },
            status: { type: "string", enum: ["DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"], example: "ACTIVE" },
            barcode: { type: "string", example: "IPH15128BLK001" },
            weight: { type: "number", example: 0.17 },
            condition: { type: "string", example: "NEW" },
          },
        },
        AddressInput: {
          type: "object",
          required: ["recipientName", "phone", "addressLine", "city"],
          properties: {
            recipientName: { type: "string", example: "Sok Phari" },
            phone: { type: "string", example: "012345678" },
            addressLine: { type: "string", example: "Street 1" },
            city: { type: "string", example: "Phnom Penh" },
            province: { type: "string", example: "Phnom Penh" },
            postalCode: { type: "string", example: "12000" },
            country: { type: "string", example: "Cambodia" },
            isDefault: { type: "boolean", example: true },
          },
        },
        CartItemInput: {
          type: "object",
          required: ["productVariantId", "quantity"],
          properties: {
            productVariantId: { type: "string", format: "uuid" },
            quantity: { type: "integer", example: 1 },
          },
        },
        CheckoutInput: {
          type: "object",
          required: ["addressId", "paymentMethod"],
          properties: {
            addressId: { type: "string", format: "uuid" },
            paymentMethod: { type: "string", enum: ["CASH_ON_DELIVERY", "MOCK_CARD", "MOCK_QR"], example: "CASH_ON_DELIVERY" },
            notes: { type: "string", example: "Please call before delivery." },
          },
        },
        ReviewInput: {
          type: "object",
          required: ["rating"],
          properties: {
            rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
            comment: { type: "string", example: "Great product and fast delivery." },
          },
        },
        StatusInput: {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", example: "APPROVED" },
          },
        },
      },
    },
    tags: [
      { name: "Health" },
      { name: "Auth" },
      { name: "Users" },
      { name: "Brands" },
      { name: "Categories" },
      { name: "Products" },
      { name: "Admin Catalog" },
      { name: "Addresses" },
      { name: "Cart" },
      { name: "Checkout" },
      { name: "Orders" },
      { name: "Wishlist" },
      { name: "Reviews" },
      { name: "Admin Orders" },
      { name: "Admin Payments" },
      { name: "Admin Inventory" },
    ],
  },
  apis: ["./src/routes/*.js"],
});

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => {
    res.status(200).json(swaggerSpec);
  });
}

module.exports = {
  setupSwagger,
  swaggerSpec,
};
