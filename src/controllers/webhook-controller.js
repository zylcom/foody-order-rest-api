import webhookService from "../services/webhook-service.js";

const webhook = async (req, res, next) => {
  try {
    await webhookService.webhook({ ...req.body });

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

export default { webhook };
