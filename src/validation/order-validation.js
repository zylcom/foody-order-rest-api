import { z } from "zod";

const orderValidation = z
  .object({
    username: z.string({ required_error: "Username is required!" }).nonempty({ message: "Username is not allowed to be empty!" }),
    guestUserId: z
      .string({ invalid_type_error: "Guest user id must be a string!", required_error: "Guest user id is required!" })
      .nonempty({ message: "Guest user id not allowed to be empty" })
      .uuid({ message: "Guest user id is invalid!" }),
    orderId: z.coerce
      .number({ invalid_type_error: "Order id must be number!", required_error: "Order id is required!" })
      .positive({ message: "Order id must be positive number!" }),
    userId: z.coerce.string({ required_error: "User id is required!" }).nonempty({ message: "User id is not allowed to be empty!" }),
  })
  .partial()
  .strict();

const getOrderValidation = orderValidation.required({ orderId: true });

const cancelOrderValidation = orderValidation.required({ orderId: true });

const checkoutValidation = orderValidation.required({ orderId: true });

export { checkoutValidation, getOrderValidation, cancelOrderValidation };
