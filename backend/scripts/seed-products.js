const pool = require("../src/config/database");
const { createSlug } = require("../src/utils/slug");

const products = [
  ["Apple", "Smartphone", "iPhone 15", "Apple smartphone with A16 Bionic chip.", 799, "Black", "128GB", "6GB", 749, 12, true],
  ["Apple", "Smartphone", "iPhone 15 Pro", "Pro iPhone with titanium design and strong camera performance.", 999, "Natural Titanium", "256GB", "8GB", 949, 8, true],
  ["Apple", "Smartphone", "iPhone 16", "Latest iPhone for everyday performance and photography.", 899, "Ultramarine", "128GB", "8GB", 869, 10, true],
  ["Apple", "Watch", "Apple Watch Series 10", "Apple smartwatch for health, fitness, and notifications.", 399, "Silver", "GPS", null, 379, 7, false],
  ["Samsung", "Smartphone", "Galaxy S24", "Compact Samsung flagship with bright display and AI features.", 749, "Onyx Black", "256GB", "8GB", 699, 9, true],
  ["Samsung", "Smartphone", "Galaxy S24 Ultra", "Premium Galaxy phone with S Pen and advanced zoom camera.", 1199, "Titanium Gray", "512GB", "12GB", 1099, 6, true],
  ["Samsung", "Smartphone", "Galaxy Z Fold 6", "Foldable Samsung phone for multitasking and productivity.", 1799, "Navy", "512GB", "12GB", 1589, 4, true],
  ["Samsung", "Accessories", "Galaxy Buds4 Pro", "Wireless earbuds with active noise cancellation.", 249, "Silver", null, null, 229, 18, true],
  ["Huawei", "Smartphone", "Huawei Pura 70 Pro", "Huawei flagship phone with premium camera design.", 999, "Black", "512GB", "12GB", 899, 8, true],
  ["Huawei", "Smartphone", "Huawei Nova 14 Pro", "Slim Huawei phone with large storage and bright display.", 539, "White", "512GB", "12GB", 469, 11, false],
  ["Huawei", "Smartphone", "Huawei Mate X7", "Foldable Huawei phone for premium users.", 1999, "Red", "512GB", "16GB", 1799, 3, true],
  ["OPPO", "Smartphone", "OPPO A6C", "Affordable OPPO smartphone for daily use.", 189, "Purple", "128GB", "8GB", 179, 20, false],
  ["OPPO", "Smartphone", "OPPO Reno 12", "Stylish OPPO phone with strong selfie camera.", 399, "Rose Gold", "256GB", "12GB", 369, 13, false],
  ["Xiaomi", "Smartphone", "Xiaomi 14T", "High value Xiaomi phone with fast charging.", 499, "Blue", "256GB", "12GB", 459, 15, true],
  ["Xiaomi", "Smartphone", "Redmi Note 14 Pro", "Midrange Redmi phone with large battery.", 299, "Midnight Black", "256GB", "8GB", 279, 22, false],
  ["Vivo", "Smartphone", "Vivo V40", "Vivo smartphone with portrait camera features.", 429, "Aqua", "256GB", "12GB", 399, 9, false],
  ["Anker", "Accessories", "Anker 65W USB-C Charger", "Fast USB-C wall charger for phones and tablets.", 49, "White", null, null, 39, 30, false],
  ["JBL", "Accessories", "JBL Tune Buds", "Compact wireless earbuds with JBL sound.", 99, "Black", null, null, 79, 16, false],
  ["Sony", "Accessories", "Sony WH-CH720N", "Wireless noise cancelling headphones.", 149, "Black", null, null, 129, 10, false],
  ["Apple", "Tablet", "iPad Air 11", "Lightweight iPad for study, work, and entertainment.", 599, "Starlight", "128GB", "8GB", 569, 6, false],
];

const extraVariants = [
  ["iPhone 15", "Blue", "128GB", "6GB", 799, 749, 9],
  ["iPhone 15", "Pink", "128GB", "6GB", 799, 749, 7],
  ["Galaxy S24", "Marble Gray", "256GB", "8GB", 749, 699, 11],
  ["Galaxy S24", "Cobalt Violet", "256GB", "8GB", 749, 699, 6],
  ["Huawei Pura 70 Pro", "White", "512GB", "12GB", 999, 899, 5],
];

async function upsertBrand(client, name) {
  const slug = createSlug(name);
  const result = await client.query(
    `
      INSERT INTO brands (name, slug, description, status)
      VALUES ($1, $2, $3, 'ACTIVE')
      ON CONFLICT (slug)
      DO UPDATE SET name = EXCLUDED.name, status = 'ACTIVE', updated_at = NOW()
      RETURNING id
    `,
    [name, slug, `${name} products available at PhoneHub.`]
  );

  return result.rows[0].id;
}

async function upsertCategory(client, name) {
  const slug = createSlug(name);
  const result = await client.query(
    `
      INSERT INTO categories (name, slug, description, status)
      VALUES ($1, $2, $3, 'ACTIVE')
      ON CONFLICT (slug)
      DO UPDATE SET name = EXCLUDED.name, status = 'ACTIVE', updated_at = NOW()
      RETURNING id
    `,
    [name, slug, `${name} catalog category.`]
  );

  return result.rows[0].id;
}

function skuFor(productName, storage, color) {
  return createSlug([productName, storage, color].filter(Boolean).join("-")).toUpperCase().replace(/-/g, "-");
}

async function upsertProduct(client, item) {
  const [brandName, categoryName, name, shortDescription, basePrice, color, storage, ram, salePrice, stockQuantity, isFeatured] = item;
  const brandId = await upsertBrand(client, brandName);
  const categoryId = await upsertCategory(client, categoryName);
  const slug = createSlug(name);

  const productResult = await client.query(
    `
      INSERT INTO products (
        brand_id, category_id, name, slug, short_description, description, base_price, status, is_featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE', $8)
      ON CONFLICT (slug)
      DO UPDATE SET
        brand_id = EXCLUDED.brand_id,
        category_id = EXCLUDED.category_id,
        name = EXCLUDED.name,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        base_price = EXCLUDED.base_price,
        status = 'ACTIVE',
        is_featured = EXCLUDED.is_featured,
        deleted_at = NULL,
        updated_at = NOW()
      RETURNING id
    `,
    [
      brandId,
      categoryId,
      name,
      slug,
      shortDescription,
      `${shortDescription} This seeded product is for local storefront and API testing.`,
      basePrice,
      isFeatured,
    ]
  );

  const productId = productResult.rows[0].id;
  const sku = skuFor(name, storage, color);
  const variantResult = await client.query(
    `
      INSERT INTO product_variants (
        product_id, sku, color, storage, ram, price, sale_price, stock_quantity, low_stock_threshold, status, condition
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 5, 'ACTIVE', 'NEW')
      ON CONFLICT (sku)
      DO UPDATE SET
        product_id = EXCLUDED.product_id,
        color = EXCLUDED.color,
        storage = EXCLUDED.storage,
        ram = EXCLUDED.ram,
        price = EXCLUDED.price,
        sale_price = EXCLUDED.sale_price,
        stock_quantity = EXCLUDED.stock_quantity,
        status = 'ACTIVE',
        updated_at = NOW()
      RETURNING id
    `,
    [productId, sku, color, storage, ram, basePrice, salePrice, stockQuantity]
  );

  await client.query(
    `
      INSERT INTO inventory_movements (product_variant_id, type, quantity, reference_type, note)
      VALUES ($1, 'STOCK_IN', $2, 'SEED', 'Seed stock for local testing')
    `,
    [variantResult.rows[0].id, stockQuantity]
  );

  return name;
}

async function upsertExtraVariant(client, item) {
  const [productName, color, storage, ram, price, salePrice, stockQuantity] = item;
  const product = await client.query("SELECT id FROM products WHERE slug = $1", [createSlug(productName)]);
  if (!product.rows[0]) return null;

  const sku = skuFor(productName, storage, color);
  const result = await client.query(
    `
      INSERT INTO product_variants (
        product_id, sku, color, storage, ram, price, sale_price, stock_quantity, low_stock_threshold, status, condition
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 5, 'ACTIVE', 'NEW')
      ON CONFLICT (sku)
      DO UPDATE SET
        color = EXCLUDED.color,
        storage = EXCLUDED.storage,
        ram = EXCLUDED.ram,
        price = EXCLUDED.price,
        sale_price = EXCLUDED.sale_price,
        stock_quantity = EXCLUDED.stock_quantity,
        status = 'ACTIVE',
        updated_at = NOW()
      RETURNING id
    `,
    [product.rows[0].id, sku, color, storage, ram, price, salePrice, stockQuantity]
  );

  await client.query(
    `
      INSERT INTO inventory_movements (product_variant_id, type, quantity, reference_type, note)
      VALUES ($1, 'STOCK_IN', $2, 'SEED', 'Seed stock for extra color variant')
    `,
    [result.rows[0].id, stockQuantity]
  );

  return sku;
}

async function run() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const names = [];
    for (const product of products) {
      names.push(await upsertProduct(client, product));
    }

    const variantSkus = [];
    for (const variant of extraVariants) {
      const sku = await upsertExtraVariant(client, variant);
      if (sku) variantSkus.push(sku);
    }

    await client.query("COMMIT");
    console.log(`Seeded ${names.length} products and ${variantSkus.length} extra color variants.`);
    console.log(names.map((name) => `- ${name}`).join("\n"));
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

run()
  .catch((error) => {
    console.error("Seed products failed");
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
