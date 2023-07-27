import { z } from "zod";

const review = z
  .object({
    description: z.string(),
    rating: z.coerce.number({ invalid_type_error: "Rating must be a number!" }).min(1).max(5).positive(),
    productSlug: z.string({ required_error: "Product slug is required!" }).nonempty("Product slug is not allowed to be empty!"),
    username: z.string({ required_error: "Username is required!" }).nonempty("Username is not allowed to be empty!"),
  })
  .partial()
  .strict();

const createReviewValidation = review.required({ rating: true, productSlug: true, username: true });

const updateReviewValidation = review.required({ rating: true, productSlug: true, username: true });

export { createReviewValidation, updateReviewValidation };
