const request = require("supertest");
const app = require("../../src/app");
const pool = require("../../src/config/database");
const { hashPassword } = require("../../src/utils/password");

const stamp = Date.now();
const prefix = `jest_${stamp}`;
const password = "Password123";

async function cleanup() {
  const userEmails = [
    `${prefix}_customer@example.com`,
    `${prefix}_other@example.com`,
    `${prefix}_admin@example.com`,
  ];

  const users = await pool.query("SELECT id FROM users WHERE email = ANY($1::text[])", [userEmails]);
  const userIds = users.rows.map((row) => row.id);

  if (userIds.length) {
    const orders = await pool.query("SELECT id FROM orders WHERE user_id = ANY($1::uuid[])", [userIds]);
    const orderIds = orders.rows.map((row) => row.id);

    if (orderIds.length) {
      await pool.query("DELETE FROM inventory_movements WHERE reference_type = 'ORDER' AND reference_id = ANY($1::uuid[])", [orderIds]);
      await pool.query("DELETE FROM payments WHERE order_id = ANY($1::uuid[])", [orderIds]);
      await pool.query("DELETE FROM order_items WHERE order_id = ANY($1::uuid[])", [orderIds]);
      await pool.query("DELETE FROM orders WHERE id = ANY($1::uuid[])", [orderIds]);
    }
  }

  await pool.query("DELETE FROM reviews WHERE product_id IN (SELECT id FROM products WHERE name LIKE $1)", [`${prefix}%`]);
  await pool.query("DELETE FROM wishlists WHERE product_id IN (SELECT id FROM products WHERE name LIKE $1)", [`${prefix}%`]);
  await pool.query("DELETE FROM users WHERE email = ANY($1::text[])", [userEmails]);
  await pool.query("DELETE FROM product_variants WHERE sku LIKE $1", [`${prefix}%`]);
  await pool.query("DELETE FROM products WHERE name LIKE $1", [`${prefix}%`]);
  await pool.query("DELETE FROM categories WHERE name LIKE $1", [`${prefix}%`]);
  await pool.query("DELETE FROM brands WHERE name LIKE $1", [`${prefix}%`]);
}

async function createAdmin() {
  const passwordHash = await hashPassword(password);
  await pool.query(
    "INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ($1, $2, $3, $4, 'ADMIN')",
    ["Jest", "Admin", `${prefix}_admin@example.com`, passwordHash]
  );

  const response = await request(app).post("/api/v1/auth/login").send({
    email: `${prefix}_admin@example.com`,
    password,
  });

  return response.body.data.tokens.accessToken;
}

describe("core PhoneHub API flow", () => {
  let customerToken;
  let otherToken;
  let adminToken;
  let brandId;
  let categoryId;
  let productId;
  let variantId;
  let cartItemId;
  let addressId;
  let orderId;
  let reviewId;

  beforeAll(async () => {
    await cleanup();
    adminToken = await createAdmin();
  });

  afterAll(async () => {
    await cleanup();
    await pool.end();
  });

  test("registers and logs in customers", async () => {
    const registerResponse = await request(app).post("/api/v1/auth/register").send({
      firstName: "Jest",
      lastName: "Customer",
      email: `${prefix}_customer@example.com`,
      password,
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.data.user.email).toBe(`${prefix}_customer@example.com`);
    customerToken = registerResponse.body.data.tokens.accessToken;

    const otherResponse = await request(app).post("/api/v1/auth/register").send({
      firstName: "Jest",
      lastName: "Other",
      email: `${prefix}_other@example.com`,
      password,
    });

    expect(otherResponse.status).toBe(201);
    otherToken = otherResponse.body.data.tokens.accessToken;
  });

  test("blocks customer from admin route and allows admin catalog setup", async () => {
    const blockedResponse = await request(app)
      .post("/api/v1/admin/brands")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ name: `${prefix} blocked brand` });

    expect(blockedResponse.status).toBe(403);

    const brandResponse = await request(app)
      .post("/api/v1/admin/brands")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: `${prefix} Brand` });

    expect(brandResponse.status).toBe(201);
    brandId = brandResponse.body.data.brand.id;

    const categoryResponse = await request(app)
      .post("/api/v1/admin/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: `${prefix} Category` });

    expect(categoryResponse.status).toBe(201);
    categoryId = categoryResponse.body.data.category.id;
  });

  test("creates product and variant, then lists public products", async () => {
    const productResponse = await request(app)
      .post("/api/v1/admin/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        brandId,
        categoryId,
        name: `${prefix} Phone`,
        basePrice: 500,
        status: "ACTIVE",
      });

    expect(productResponse.status).toBe(201);
    productId = productResponse.body.data.product.id;

    const variantResponse = await request(app)
      .post(`/api/v1/admin/products/${productId}/variants`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        sku: `${prefix}-SKU`,
        color: "Black",
        storage: "128GB",
        ram: "8GB",
        price: 500,
        salePrice: 450,
        stockQuantity: 5,
        status: "ACTIVE",
      });

    expect(variantResponse.status).toBe(201);
    variantId = variantResponse.body.data.variant.id;

    const listResponse = await request(app).get(`/api/v1/products?search=${prefix}&availability=in_stock`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.some((product) => product.id === productId)).toBe(true);
  });

  test("manages cart and rejects stock overage", async () => {
    const addResponse = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ productVariantId: variantId, quantity: 2 });

    expect(addResponse.status).toBe(200);
    expect(addResponse.body.data.cart.summary.totalQuantity).toBe(2);
    cartItemId = addResponse.body.data.cart.items[0].id;

    const overStockResponse = await request(app)
      .patch(`/api/v1/cart/items/${cartItemId}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ quantity: 10 });

    expect(overStockResponse.status).toBe(400);
  });

  test("creates address and checks out order", async () => {
    const addressResponse = await request(app)
      .post("/api/v1/addresses")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        recipientName: "Jest Customer",
        phone: "012345678",
        addressLine: "Street 1",
        city: "Phnom Penh",
      });

    expect(addressResponse.status).toBe(201);
    addressId = addressResponse.body.data.address.id;

    const checkoutResponse = await request(app)
      .post("/api/v1/checkout")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ addressId, paymentMethod: "CASH_ON_DELIVERY" });

    expect(checkoutResponse.status).toBe(201);
    expect(checkoutResponse.body.data.order.items).toHaveLength(1);
    orderId = checkoutResponse.body.data.order.id;

    const cartResponse = await request(app)
      .get("/api/v1/cart")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(cartResponse.body.data.cart.items).toHaveLength(0);
  });

  test("supports wishlist", async () => {
    const addResponse = await request(app)
      .post(`/api/v1/wishlist/${productId}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(addResponse.status).toBe(201);

    const duplicateResponse = await request(app)
      .post(`/api/v1/wishlist/${productId}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(duplicateResponse.status).toBe(409);
  });

  test("supports reviews after delivered purchase and admin approval", async () => {
    const pendingReviewResponse = await request(app)
      .post(`/api/v1/products/${productId}/reviews`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ rating: 5, comment: "Great test product" });

    expect(pendingReviewResponse.status).toBe(403);

    await request(app)
      .patch(`/api/v1/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "CONFIRMED" })
      .expect(200);
    await request(app)
      .patch(`/api/v1/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "PROCESSING" })
      .expect(200);
    await request(app)
      .patch(`/api/v1/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "SHIPPED" })
      .expect(200);
    await request(app)
      .patch(`/api/v1/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "DELIVERED" })
      .expect(200);

    const reviewResponse = await request(app)
      .post(`/api/v1/products/${productId}/reviews`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ rating: 5, comment: "Great test product" });

    expect(reviewResponse.status).toBe(201);
    expect(reviewResponse.body.data.review.status).toBe("PENDING");
    reviewId = reviewResponse.body.data.review.id;

    await request(app)
      .patch(`/api/v1/admin/reviews/${reviewId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "APPROVED" })
      .expect(200);

    const publicReviews = await request(app).get(`/api/v1/products/${productId}/reviews`);
    expect(publicReviews.status).toBe(200);
    expect(publicReviews.body.data.some((review) => review.id === reviewId)).toBe(true);

    const crossUserDelete = await request(app)
      .delete(`/api/v1/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(crossUserDelete.status).toBe(404);
  });
});
