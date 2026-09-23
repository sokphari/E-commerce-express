const ApiError = require("../utils/api-error");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return next(new ApiError(422, "Validation failed", errors));
    }

    req.validated = result.data;
    return next();
  };
}

module.exports = validate;
