import express from "express";
import webhookController from "../controllers/webhook-controller.js";

const webhookRouter = new express.Router();

webhookRouter.post(
  "/api/webhook",
  express.raw({
    type: "application/json",
  }),
  webhookController.webhook
);

export { webhookRouter };
