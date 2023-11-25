import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../routes/public-api.js";
import { userRouter } from "../routes/api.js";
import { webhookRouter } from "../routes/webhook.js";

export const web = express();
const corsOptions = {
  origin: "*",
};

const file = fs.readFileSync(path.join(process.cwd(), "src", "docs", "api-spec.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);

const options = {
  customCssUrl: "/api-docs/swagger-ui.css",
};

web.use(cors(corsOptions));
web.use(webhookRouter);
web.use(express.json());
web.use(express.static(path.resolve("./public")));
web.use("/api/docs", express.static("node_modules/swagger-ui-dist/", { index: false }), swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
