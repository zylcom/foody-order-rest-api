import { z } from "zod";

const orderIdValidation = z.coerce
  .number({ invalid_type_error: "Order id must be number!", required_error: "Order id is required!" })
  .positive({ message: "Order id must be positive number!" });
const usernameValidation = z.string({ required_error: "Username is required!" }).nonempty({ message: "Username is not allowed to be empty!" });

const createOrderValidation = z.string({ required_error: "Username is required!" }).max(100).nonempty({ message: "Username is not allowed to be empty!" });

const checkoutValidation = z
  .object({
    username: usernameValidation,
    userId: z.coerce.string({ required_error: "User id is required!" }).nonempty({ message: "User id is not allowed to be empty!" }),
    orderId: orderIdValidation,
  })
  .strict();

const getOrderValidation = z.object({ username: usernameValidation, orderId: orderIdValidation }).strict();

const cancelOrderValidation = z.object({ username: usernameValidation, orderId: orderIdValidation }).strict();

export { createOrderValidation, checkoutValidation, getOrderValidation, cancelOrderValidation };
