import express from "express";
import webhookController from "../controllers/webhook-controller.js";

const webhookRouter = new express.Router();

webhookRouter.post("/api/webhook", webhookController.webhook);

export { webhookRouter };
