import { ApiError } from "../utils/ApiError.js";

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("You must be logged in"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden("You do not have permission to do this")
      );
    }

    next();
  };
}
