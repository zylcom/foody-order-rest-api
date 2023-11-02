import { z } from "zod";

const createFeedbackValidation = z
  .object({
    description: z
      .string({ invalid_type_error: "Feedback description must be a string!", required_error: "Feedback description is required!" })
      .nonempty({ message: "Feedback description not allowed to be empty!" }),
    username: z.string({ invalid_type_error: "Username must be a string!" }).nonempty({ message: "Username is not allowed to be empty!" }).optional(),
    guestUserId: z
      .string({ invalid_type_error: "Guest user id must be a string!" })
      .nonempty({ message: "Guest user id not allowed to be empty" })
      .uuid({ message: "Guest user id is invalid!" })
      .optional(),
  })
  .strict();

export { createFeedbackValidation };
