const pool = require("../config/database");

async function createRefreshToken({ userId, tokenHash, expiresAt }) {
  const result = await pool.query(
    `
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, token_hash, expires_at, revoked_at, created_at
    `,
    [userId, tokenHash, expiresAt]
  );

  return result.rows[0];
}

async function findActiveByHash(tokenHash) {
  const result = await pool.query(
    `
      SELECT id, user_id, token_hash, expires_at, revoked_at, created_at
      FROM refresh_tokens
      WHERE token_hash = $1
        AND revoked_at IS NULL
        AND expires_at > NOW()
    `,
    [tokenHash]
  );

  return result.rows[0] || null;
}

async function revokeByHash(tokenHash) {
  await pool.query(
    `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE token_hash = $1
        AND revoked_at IS NULL
    `,
    [tokenHash]
  );
}

module.exports = {
  createRefreshToken,
  findActiveByHash,
  revokeByHash,
};
