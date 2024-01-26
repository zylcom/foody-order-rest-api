import { z } from "zod";

const getPaymentValidation = z
  .object({
    username: z
      .string({ invalid_type_error: "Username must be a string.", required_error: "Username is required!" })
      .min(1, { message: "Username is not allowed to be empty." })
      .optional(),
    guestUserId: z
      .string({ invalid_type_error: "Guest user id must be a string.", required_error: "Guest user id is required!" })
      .min(1, { message: "Guest user id not allowed to be empty." })
      .uuid({ message: "Guest user id is invalid." })
      .optional(),
    transactionId: z
      .string({ invalid_type_error: "Transaction id must be a string.", required_error: "Transaction id is required!" })
      .min(1, { message: "Transaction id is not allowed to be empty." })
      .uuid({ message: "Transaction id is invalid." }),
  })
  .strict();

export { getPaymentValidation };
