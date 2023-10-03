import webhookService from "../services/webhook-service.js";

const webhook = async (req, res, next) => {
  try {
    const request = {
      body: req.body,
      sig: req.headers["stripe-signature"],
    };

    await webhookService.webhook(request);

    res.status(200).json({ received: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default { webhook };
