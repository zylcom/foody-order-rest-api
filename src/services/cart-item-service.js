import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { calculateTotalPrice } from "../utils/index.js";
import { deleteItemValidation, findItemValidation, getCartItemValidation, upsertCartItemValidation } from "../validation/cart-item-validation.js";
import validate from "../validation/validation.js";
import cartService from "./cart-service.js";

const get = async (username) => {
  username = validate(getCartItemValidation, username);

  return prismaClient.cartItem.findMany({ where: { cart: { username } } });
};

const find = async (request) => {
  request = validate(findItemValidation, request);

  const item = await prismaClient.cartItem.findUnique({ where: { item: { cartId: request.cartId, productSlug: request.productSlug } } });

  if (!item) {
    throw new ResponseError(404, "Item not found!");
  }

  return item;
};

const upsert = async (request) => {
  request = validate(upsertCartItemValidation, request);

  const countProduct = await prismaClient.product.count({ where: { slug: request.productSlug } });

  if (countProduct !== 1) {
    throw new ResponseError(404, "Product not found!");
  }

  return prismaClient.cartItem
    .upsert({
      update: { cart: { connect: { id: request.cartId } }, product: { connect: { slug: request.productSlug } }, quantity: request.quantity },
      create: { cart: { connect: { id: request.cartId } }, product: { connect: { slug: request.productSlug } }, quantity: request.quantity },
      where: { item: { productSlug: request.productSlug, cartId: request.cartId } },
      include: { product: true },
    })
    .then(async (result) => {
      const items = await prismaClient.cartItem.findMany({ where: { cartId: request.cartId }, include: { product: true } });
      const totalPrice = calculateTotalPrice(items);

      await prismaClient.cart.update({
        where: { id: request.cartId },
        data: {
          totalPrice,
        },
      });

      return result;
    });
};

const remove = async (request) => {
  request = validate(deleteItemValidation, request);

  const countItems = await prismaClient.cartItem.count({ where: { id: request.itemId } });

  if (countItems !== 1) {
    throw new ResponseError(404, "Cart item not found");
  }

  await prismaClient.cartItem.delete({ where: { id: request.itemId } }).then(async (result) => {
    const items = await prismaClient.cartItem.findMany({ where: { cartId: request.cartId }, include: { product: true } });
    const totalPrice = calculateTotalPrice(items);

    await prismaClient.cart.update({
      where: { id: request.cartId },
      data: {
        totalPrice,
      },
    });

    return result;
  });
};

export default { get, find, upsert, remove };
