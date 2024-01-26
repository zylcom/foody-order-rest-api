import { z } from "zod";

const filterValidation = z
  .object({
    categorySlug: z
      .string({ invalid_type_error: "Category slug must be a string." })
      .max(50, { message: "Category slug too long. Please enter no more than 50." })
      .default(""),
  })
  .partial()
  .strip();

export { filterValidation };
