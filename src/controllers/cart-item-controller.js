import cartItemService from "../services/cart-item-service.js";

const get = async (req, res, next) => {
  try {
    const result = await cartItemService.get(req.user.username);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const find = async (req, res, next) => {
  try {
    const request = {
      cartId: req.user.cart.id,
      productSlug: req.params.productSlug,
    };
    const result = await cartItemService.find(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const upsert = async (req, res, next) => {
  try {
    const request = req.body;
    request.cartId = req.user.cart.id;

    const result = await cartItemService.upsert(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const request = {
      productSlug: req.params.productSlug,
      cartId: req.user.cart.id,
    };

    await cartItemService.remove(request);

    res.status(200).json({ data: "Cart item deleted" });
  } catch (error) {
    next(error);
  }
};

export default { get, find, upsert, remove };
