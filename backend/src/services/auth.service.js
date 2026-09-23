const jwt = require("jsonwebtoken");
const ApiError = require("../utils/api-error");
const { hashPassword, comparePassword } = require("../utils/password");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require("../utils/jwt");
const { sanitizeUser } = require("../utils/user");
const userRepository = require("../repositories/user.repository");
const refreshTokenRepository = require("../repositories/refresh-token.repository");

function getRefreshExpiryDate(refreshToken) {
  const decoded = jwt.decode(refreshToken);
  return new Date(decoded.exp * 1000);
}

async function createTokenPair(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await refreshTokenRepository.createRefreshToken({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshExpiryDate(refreshToken),
  });

  return {
    accessToken,
    refreshToken,
  };
}

async function register(input) {
  const email = input.email.toLowerCase();
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await userRepository.createUser({
    firstName: input.firstName,
    lastName: input.lastName,
    email,
    phone: input.phone,
    passwordHash,
  });

  const tokens = await createTokenPair(user);

  return {
    user: sanitizeUser(user),
    tokens,
  };
}

async function login(input) {
  const email = input.email.toLowerCase();
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "User account is not active");
  }

  const passwordMatches = await comparePassword(input.password, user.password_hash);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const tokens = await createTokenPair(user);

  return {
    user: sanitizeUser(user),
    tokens,
  };
}

async function refresh(refreshToken) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (payload.type !== "refresh") {
    throw new ApiError(401, "Invalid refresh token");
  }

  const tokenHash = hashToken(refreshToken);
  const storedToken = await refreshTokenRepository.findActiveByHash(tokenHash);

  if (!storedToken) {
    throw new ApiError(401, "Refresh token is expired or revoked");
  }

  const user = await userRepository.findById(payload.sub);

  if (!user || user.status !== "ACTIVE") {
    throw new ApiError(401, "Invalid refresh token");
  }

  await refreshTokenRepository.revokeByHash(tokenHash);
  const tokens = await createTokenPair(user);

  return {
    user: sanitizeUser(user),
    tokens,
  };
}

async function logout(refreshToken) {
  await refreshTokenRepository.revokeByHash(hashToken(refreshToken));
}

module.exports = {
  register,
  login,
  refresh,
  logout,
};
