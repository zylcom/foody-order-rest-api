import validate from "../validation/validation.js";
import { calculateTotalPrice } from "../utils/index.js";
import { cartValidation, getCartValidation } from "../validation/cart-validation.js";
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

const validateCart = async (cart) => {
  cart = validate(cartValidation, cart);

  const validCartItems = [];

  for (const item of cart.cartItems) {
    const product = await prismaClient.product.findUnique({ where: { slug: item.productSlug } });

    if (product) {
      validCartItems.push({ ...item, product });
    }
  }

  return { ...cart, cartItems: validCartItems, totalPrice: calculateTotalPrice(validCartItems) };
};

export default { get, validateCart };
