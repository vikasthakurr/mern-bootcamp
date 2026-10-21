import { ApiError } from "../utils/ApiError.js";

export function validate(rules) {
  return (req, res, next) => {
    const errors = [];
    const body = req.body || {};

    for (const field of Object.keys(rules)) {
      const rule = rules[field];
      const value = body[field];

      if (rule.required && (value === undefined || value === "")) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value === undefined || value === "") {
        continue;
      }

      if (rule.type === "number" && typeof value !== "number") {
        errors.push(`${field} must be a number`);
      }

      if (rule.type === "string" && typeof value !== "string") {
        errors.push(`${field} must be a string`);
      }

      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rule.enum.join(", ")}`);
      }
    }

    if (errors.length > 0) {
      return next(ApiError.badRequest(errors.join("; ")));
    }

    next();
  };
}
