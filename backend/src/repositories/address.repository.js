const pool = require("../config/database");

const addressSelect = `
  id,
  user_id,
  recipient_name,
  phone,
  address_line,
  city,
  province,
  postal_code,
  country,
  is_default,
  created_at,
  updated_at
`;

async function listByUserId(userId) {
  const result = await pool.query(
    `
      SELECT ${addressSelect}
      FROM addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

async function findByIdForUser(id, userId) {
  const result = await pool.query(
    `
      SELECT ${addressSelect}
      FROM addresses
      WHERE id = $1
        AND user_id = $2
    `,
    [id, userId]
  );

  return result.rows[0] || null;
}

async function hasAnyForUser(userId) {
  const result = await pool.query("SELECT 1 FROM addresses WHERE user_id = $1 LIMIT 1", [userId]);
  return Boolean(result.rows[0]);
}

async function unsetDefaultForUser(userId, client = pool) {
  await client.query(
    `
      UPDATE addresses
      SET is_default = FALSE, updated_at = NOW()
      WHERE user_id = $1
        AND is_default = TRUE
    `,
    [userId]
  );
}

async function createAddress(userId, values) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (values.isDefault) {
      await unsetDefaultForUser(userId, client);
    }

    const result = await client.query(
      `
        INSERT INTO addresses (
          user_id,
          recipient_name,
          phone,
          address_line,
          city,
          province,
          postal_code,
          country,
          is_default
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING ${addressSelect}
      `,
      [
        userId,
        values.recipientName,
        values.phone,
        values.addressLine,
        values.city,
        values.province || null,
        values.postalCode || null,
        values.country || "Cambodia",
        values.isDefault || false,
      ]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function updateAddress(id, userId, values) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (values.isDefault) {
      await unsetDefaultForUser(userId, client);
    }

    const result = await client.query(
      `
        UPDATE addresses
        SET
          recipient_name = COALESCE($3, recipient_name),
          phone = COALESCE($4, phone),
          address_line = COALESCE($5, address_line),
          city = COALESCE($6, city),
          province = COALESCE($7, province),
          postal_code = COALESCE($8, postal_code),
          country = COALESCE($9, country),
          is_default = COALESCE($10, is_default),
          updated_at = NOW()
        WHERE id = $1
          AND user_id = $2
        RETURNING ${addressSelect}
      `,
      [
        id,
        userId,
        values.recipientName,
        values.phone,
        values.addressLine,
        values.city,
        values.province,
        values.postalCode,
        values.country,
        values.isDefault,
      ]
    );

    await client.query("COMMIT");
    return result.rows[0] || null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function setDefault(id, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await unsetDefaultForUser(userId, client);

    const result = await client.query(
      `
        UPDATE addresses
        SET is_default = TRUE, updated_at = NOW()
        WHERE id = $1
          AND user_id = $2
        RETURNING ${addressSelect}
      `,
      [id, userId]
    );

    await client.query("COMMIT");
    return result.rows[0] || null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function deleteAddress(id, userId) {
  const result = await pool.query(
    `
      DELETE FROM addresses
      WHERE id = $1
        AND user_id = $2
      RETURNING ${addressSelect}
    `,
    [id, userId]
  );

  return result.rows[0] || null;
}

module.exports = {
  listByUserId,
  findByIdForUser,
  hasAnyForUser,
  createAddress,
  updateAddress,
  setDefault,
  deleteAddress,
};
