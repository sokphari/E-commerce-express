const ApiError = require("../utils/api-error");
const { verifyAccessToken } = require("../utils/jwt");
const userRepository = require("../repositories/user.repository");

async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication token is required");
    }

    const token = authorization.slice("Bearer ".length);
    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.sub);

    if (!user || user.status !== "ACTIVE") {
      throw new ApiError(401, "Invalid authentication token");
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(401, "Invalid authentication token"));
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to access this resource"));
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
