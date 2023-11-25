import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../routes/public-api.js";
import { userRouter } from "../routes/api.js";
import { webhookRouter } from "../routes/webhook.js";
import path from "path";

export const web = express();
const corsOptions = {
  origin: "*",
};

const options = {
  swaggerOptions: {
    url: "/api-docs/api-spec.json",
  },
  customCssUrl: "/api-docs/swagger-ui.css",
};

web.use(cors(corsOptions));
web.use(webhookRouter);
web.use(express.json());
web.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ errors: "Invalid request body. Please send valid JSON!" });
  }

  next();
});
web.use(express.static(path.resolve("./public")));
web.use("/api/docs", express.static("node_modules/swagger-ui-dist/", { index: false }), swaggerUi.serve, swaggerUi.setup(null, options));
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
