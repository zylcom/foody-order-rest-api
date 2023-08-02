import { z } from "zod";

const createOrderValidation = z.string({ required_error: "Username is required!" }).max(100).nonempty({ message: "Username is not allowed to be empty!" });

const checkoutValidation = z
  .object({
    username: z.string({ required_error: "Username is required!" }).nonempty({ message: "Username is not allowed to be empty!" }),
    userId: z.coerce.string({ required_error: "User id is required!" }).nonempty({ message: "User id is not allowed to be empty!" }),
    orderId: z.coerce
      .number({ invalid_type_error: "Order id must be number!", required_error: "Order id is required!" })
      .positive({ message: "Order id must be positive number!" }),
  })
  .strict();

const getOrderValidation = z.coerce
  .number({ invalid_type_error: "Order id must be number!", required_error: "Order id is required!" })
  .positive({ message: "Order id must be positive number!" });

export { createOrderValidation, checkoutValidation, getOrderValidation };
