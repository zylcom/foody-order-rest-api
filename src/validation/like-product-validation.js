import { z } from "zod";

const likeValidation = z
  .object({
    productSlug: z.string({ required_error: "Product slug is required!" }).nonempty("Product slug is not allowed to be empty!"),
    username: z.string({ required_error: "Username is required!" }).nonempty("Username is not allowed to be empty!"),
  })
  .strict();

export { likeValidation };
