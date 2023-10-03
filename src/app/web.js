import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../routes/public-api.js";
import { userRouter } from "../routes/api.js";
// import { webhookRouter } from "../routes/webhook.js";
import webhookController from "../controllers/webhook-controller.js";

export const web = express();
const corsOptions = {
  origin: "*",
};

web.use(cors(corsOptions));
// web.use(webhookRouter);
web.post(
  "/api/webhook",
  express.raw({
    type: "application/json",
  }),
  webhookController.webhook
);
web.use(express.json());
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
