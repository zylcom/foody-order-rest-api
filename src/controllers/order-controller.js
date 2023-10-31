import orderService from "../services/order-service.js";

const create = async (req, res, next) => {
  try {
    const request = {
      cart: req.body,
      username: req?.user?.username,
      guestUserId: req.guestUserId,
    };

    const result = await orderService.create(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const checkout = async (req, res, next) => {
  try {
    const request = {
      userId: req?.user?.id,
      orderId: req.query.id,
      guestUserId: req.guestUserId,
    };

    const result = await orderService.checkout(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const request = {
      username: req?.user?.username,
      guestUserId: req.guestUserId,
      orderId: req.params.orderId,
    };

    const result = await orderService.get(request);

    res.status(200).set("Cache-Control", "public, max-age=0, s-maxage=1, stale-while-revalidate=30").send({ data: result });
  } catch (error) {
    next(error);
  }
};

const cancel = async (req, res, next) => {
  try {
    const request = {
      username: req?.user?.username,
      guestUserId: req.guestUserId,
      orderId: req.params.orderId,
    };

    const result = await orderService.cancel(request);

    res.status(200).send({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { create, checkout, get, cancel };
