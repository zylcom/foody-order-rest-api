import { z } from "zod";

const getPaymentValidation = z
  .object({
    username: z.string({ required_error: "Username is required!" }).nonempty({ message: "Username is not allowed to be empty!" }).optional(),
    guestUserId: z
      .string({ invalid_type_error: "Guest user id must be a string!", required_error: "Guest user id is required!" })
      .nonempty({ message: "Guest user id not allowed to be empty" })
      .uuid({ message: "Guest user id is invalid!" })
      .optional(),
    sessionId: z
      .string({ invalid_type_error: "Session id must be a string!", required_error: "Session id is required!" })
      .nonempty({ message: "Session id is not allowed to be empty!" }),
  })
  .strict();

export { getPaymentValidation };
