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
    url: "https://gist.githubusercontent.com/zylcom/090fb0e5b523832810f7da8a9ba87f2f/raw/c0587de1830a2c965199172d997d1bf424803945/foody-order-api-spec.json",
  },
  customCssUrl: path.join(process.cwd(), "public", "api-docs", "swagger-ui.css"),
};

web.use(cors(corsOptions));
web.use(webhookRouter);
web.use(express.json());
web.use(express.static(path.join(process.cwd(), "public")));
web.use("/api/docs", express.static("node_modules/swagger-ui-dist/", { index: false }), swaggerUi.serve, swaggerUi.setup(null, options));
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
