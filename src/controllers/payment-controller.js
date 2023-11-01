import paymentService from "../services/payment-service.js";

const get = async (req, res, next) => {
  try {
    const request = {
      username: req?.user?.username,
      sessionId: req.params.sessionId,
      guestUserId: req.guestUserId,
    };

    const result = await paymentService.get(request);

    res.status(200).json({ data: result });
  } catch (error) {
    // console.log(error);

    next(error);
  }
};

export default { get };
