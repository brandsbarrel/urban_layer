import { ValidationError } from "../shared/app-error.js";

const validate = (schema, target = "body") => {
  return (req, res, next) => {
    console.log("=================================");
    console.log("TARGET:", target);
    console.log("REQ.BODY:", req.body);
    console.log("REQ[TARGET]:", req[target]);

    const result = schema.safeParse(req[target]);

    console.log("PARSE RESULT:", result);

    if (!result.success) {
      console.log("ISSUES:", result.error.issues);

      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || target,
        message: issue.message,
      }));

      return next(new ValidationError({ errors }));
    }

    // req.query is a getter in Express, cannot be reassigned
    // Store validated data on a separate property instead
    if (target === "query") {
      req.validatedQuery = result.data;
    } else {
      req[target] = result.data;
    }
    return next();
  };
};

export { validate };