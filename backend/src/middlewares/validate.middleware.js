import { ValidationError } from "../shared/app-error.js";

const validate = (schema, target = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || target,
        message: issue.message
      }));

      return next(new ValidationError({ errors }));
    }

    req[target] = result.data;
    return next();
  };
};

export { validate };
