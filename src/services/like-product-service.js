import productService from "./product-service.js";
import validate from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import { likeValidation } from "../validation/like-product-validation.js";
import { ResponseError } from "../errors/response-error.js";

const like = async (request) => {
  request = validate(likeValidation, request);

  const countLike = await prismaClient.likeOnProduct.count({ where: { AND: [{ username: request.username }, { productSlug: request.productSlug }] } });

  await productService.get(request.productSlug);

  if (countLike > 0) {
    throw new ResponseError(409, "Product is already liked!");
  }

  return prismaClient.likeOnProduct.create({ data: { user: { connect: { username: request.username } }, product: { connect: { slug: request.productSlug } } } });
};

const neutral = async (request) => {
  request = validate(likeValidation, request);

  const countLike = await prismaClient.likeOnProduct.count({ where: { AND: [{ username: request.username }, { productSlug: request.productSlug }] } });

  await productService.get(request.productSlug);

  if (countLike !== 1) {
    throw new ResponseError(400, "Product is not liked!");
  }

  return prismaClient.likeOnProduct.delete({ where: { like: { productSlug: request.productSlug, username: request.username } } });
};

export default { like, neutral };
