import { ZodError } from "zod";
import { ResponseError } from "../errors/response-error.js";

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();

    return;
  }

  if (err instanceof ResponseError) {
    res.status(err.status).json({ errors: err.message }).end();
  } else if (err instanceof ZodError) {
    res
      .status(400)
      .json({ errors: err.issues.map((issue) => issue.message).join(", ") })
      .end();
  } else {
    res.status(500).json({ errors: err.message }).end();
  }
};

export { errorMiddleware };
