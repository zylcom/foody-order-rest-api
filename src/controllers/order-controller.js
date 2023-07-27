import orderService from "../services/order-service.js";

const create = async (req, res, next) => {
  try {
    const username = req.user.username;

    const result = await orderService.create(username);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const checkout = async (req, res, next) => {
  try {
    const request = {
      userId: req.user.id,
      orderId: req.query.orderId,
      username: req.user.username,
    };

    const result = await orderService.checkout(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { create, checkout };
