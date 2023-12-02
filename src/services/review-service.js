import productService from "./product-service.js";
import validate from "../validation/validation.js";
import { createReviewValidation, updateReviewValidation } from "../validation/review-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";

const create = async (request) => {
  request = validate(createReviewValidation, request);

  const countReview = await prismaClient.review.count({
    where: {
      AND: [{ productSlug: request.productSlug }, { username: request.username }],
    },
  });
  await productService.get(request.productSlug);

  if (countReview > 0) {
    throw new ResponseError(409, "Review already exist!");
  }

  const review = await prismaClient.review.create({
    data: {
      rating: request.rating,
      description: request.description,
      user: { connect: { username: request.username } },
      product: { connect: { slug: request.productSlug } },
    },
  });

  await prismaClient.product
    .findUnique({
      where: { slug: request.productSlug },
      include: { reviews: { select: { rating: true } } },
    })
    .then((product) => {
      let sumRating = 0;

      for (const review of product.reviews) {
        sumRating += review.rating;
      }

      const averageRating = sumRating / product.reviews.length;

      return prismaClient.product.update({ where: { slug: product.slug }, data: { averageRating } });
    });

  return review;
};

const update = async (request) => {
  request = validate(updateReviewValidation, request);

  const countReview = await prismaClient.review.count({
    where: {
      AND: [{ productSlug: request.productSlug }, { username: request.username }],
    },
  });

  if (countReview !== 1) {
    throw new ResponseError(404, "Review not found!");
  }

  const data = {
    description: request.description,
  };

  if (request.rating) {
    data.rating = request.rating;
  }

  const updatedReview = await prismaClient.review.update({
    where: { review: { productSlug: request.productSlug, username: request.username } },
    data,
  });

  await prismaClient.product
    .findUnique({
      where: { slug: request.productSlug },
      include: { reviews: { select: { rating: true } } },
    })
    .then((product) => {
      let sumRating = 0;

      for (const review of product.reviews) {
        sumRating += review.rating;
      }

      const averageRating = sumRating / product.reviews.length;

      return prismaClient.product.update({ where: { slug: product.slug }, data: { averageRating } });
    });

  return updatedReview;
};

export default { create, update };
