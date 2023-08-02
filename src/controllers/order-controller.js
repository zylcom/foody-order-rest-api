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
    console.log(req.query);

    const request = {
      userId: req.user.id,
      orderId: req.query.id,
      username: req.user.username,
    };

    const result = await orderService.checkout(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    const result = await orderService.get(orderId);

    res.status(200).set("Cache-Control", "public, max-age=0, s-maxage=1, stale-while-revalidate=30").send({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { create, checkout, get };
