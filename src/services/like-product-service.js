import validate from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import { likeValidation } from "../validation/like-product-validation.js";
import { ResponseError } from "../errors/response-error.js";
import productService from "./product-service.js";

const like = async (request) => {
  request = validate(likeValidation, request);

  const countLike = await prismaClient.likeOnProduct.count({ where: { AND: [{ username: request.username }, { productSlug: request.productSlug }] } });
  const product = await productService.get(request.productSlug);

  if (countLike > 0) {
    throw new ResponseError(400, "Product is already liked!");
  }

  if (!product) {
    throw new ResponseError(404, "Product not found!");
  }

  return prismaClient.likeOnProduct.create({ data: { user: { connect: { username: request.username } }, product: { connect: { slug: request.productSlug } } } });
};

const neutral = async (request) => {
  request = validate(likeValidation, request);

  const countLike = await prismaClient.likeOnProduct.count({ where: { AND: [{ username: request.username }, { productSlug: request.productSlug }] } });
  const product = await productService.get(request.productSlug);

  if (countLike !== 1) {
    throw new ResponseError(400, "Product is not liked!");
  }

  if (!product) {
    throw new ResponseError(404, "Product not found!");
  }

  return prismaClient.likeOnProduct.delete({ where: { like: { productSlug: request.productSlug, username: request.username } } });
};

export default { like, neutral };
