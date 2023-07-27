import validate from "../validation/validation.js";
import { getCartValidation } from "../validation/cart-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";

const get = async (username) => {
  username = validate(getCartValidation, username);

  const cart = await prismaClient.cart.findUnique({ where: { username }, include: { cartItems: { include: { product: true } } } });

  if (!cart) {
    throw new ResponseError(404, "Cart not found");
  }

  return cart;
};

export default { get };
