const { sanitizeUser } = require("../utils/user");

async function getCurrentUser(req, res) {
  res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(req.user),
    },
  });
}

module.exports = {
  getCurrentUser,
};
