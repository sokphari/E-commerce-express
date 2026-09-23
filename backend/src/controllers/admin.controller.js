const { sanitizeUser } = require("../utils/user");

async function getAdminMe(req, res) {
  res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(req.user),
    },
  });
}

module.exports = {
  getAdminMe,
};
