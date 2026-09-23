const pool = require("../config/database");

const userSelect = `
  id,
  first_name,
  last_name,
  email,
  phone,
  password_hash,
  role,
  status,
  email_verified_at,
  created_at,
  updated_at
`;

async function createUser({ firstName, lastName, email, phone, passwordHash, role = "CUSTOMER" }) {
  const result = await pool.query(
    `
      INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ${userSelect}
    `,
    [firstName, lastName, email, phone || null, passwordHash, role]
  );

  return result.rows[0];
}

async function findByEmail(email) {
  const result = await pool.query(`SELECT ${userSelect} FROM users WHERE email = $1`, [email]);
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await pool.query(`SELECT ${userSelect} FROM users WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

module.exports = {
  createUser,
  findByEmail,
  findById,
};
