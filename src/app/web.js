import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
// import swaggerDocument from "../../docs/openapi.json";
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../routes/public-api.js";
import { userRouter } from "../routes/api.js";
import { webhookRouter } from "../routes/webhook.js";

export const web = express();
const corsOptions = {
  origin: "*",
};

const swaggerDocument = JSON.parse(fs.readFileSync(path.join(process.cwd(), "docs", "openapi.json")));
const cssUrl = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.2/swagger-ui.min.css";

web.use(cors(corsOptions));
web.use(webhookRouter);
web.use(express.json());
web.use(
  "/api/docs",
  function (req, res, next) {
    swaggerDocument.servers = [{ url: `http://${req.get("host")}/api` }];

    req.swaggerDoc = swaggerDocument;

    next();
  },
  swaggerUi.serveFiles(swaggerDocument, { customCssUrl: cssUrl }),
  swaggerUi.setup()
);
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
