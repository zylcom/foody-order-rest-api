import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

const customerDetailsValidation = z.object(
  {
    name: z
      .string({
        invalid_type_error: "Name must be a string.",
        required_error: "Name is required!",
      })
      .max(100, {
        message: "Your name is too long. Please enter no more than 100.",
      })
      .min(1, { message: "Name is not allowed to be empty!" }),
    phonenumberForm: z
      .object(
        {
          number: z
            .string({ invalid_type_error: "Phone number must be a string!", required_error: "Phone number is required!" })
            .min(10, { message: "Your phone number must be at least 10 characters!" })
            .max(25, { message: "Your phone number is too long. Please enter no more than 25 characters!" }),
          countryCode: z
            .string({ invalid_type_error: "Country code must be a string!", required_error: "Country code is required!" })
            .min(1, { message: "Country code is not allowed to be empty!" })
            .max(2, { message: "Country code is too long. Country codes are two-letter, defined in ISO 3166-1 alpha-2." })
            .default("ID"),
        },
        { invalid_type_error: "Phone number form must be an object!", required_error: "Phone number form is required!" }
      )
      .refine((data) => isValidPhoneNumber(data.number, data.countryCode), { message: "Phone number is invalid!" }),
  },
  { invalid_type_error: "Customer details must be an object.", required_error: "Customer details is required!" }
);

const deliveryDetailsValidation = z.object(
  {
    cost: z
      .number({ invalid_type_error: "Delivery cost must be a number.", required_error: "Delivery cost is required!" })
      .gte(0, { message: "Delivery cost must be greater than or equal to 0." }),
    method: z
      .string({
        invalid_type_error: "Delivery method must be a string.",
        required_error: "Delivery method is required!",
      })
      .min(1, { message: "Delivery method not allowed to be empty." }),
  },
  { invalid_type_error: "Delivery details must be an object.", required_error: "Delivery details is required!" }
);

const shippingDetailsValidation = z.object(
  {
    address: z
      .string({
        invalid_type_error: "Shipping address must be a string.",
        required_error: "Shipping address is required!",
      })
      .min(1, { message: "Shipping address not allowed to be empty." }),
    detail: z
      .string({
        invalid_type_error: "Detail home must be a string.",
        required_error: "Detail home is required!",
      })
      .min(1, { message: "Detail home not allowed to be empty." }),
    city: z
      .string({
        invalid_type_error: "City must be a string.",
        required_error: "City is required!",
      })
      .min(1, { message: "City not allowed to be empty." }),
    state: z
      .string({
        invalid_type_error: "State must be a string.",
        required_error: "State is required!",
      })
      .min(1, { message: "State not allowed to be empty." }),
    postalCode: z.coerce
      .string({
        invalid_type_error: "Postal code must be a string.",
        required_error: "Postal code is required!",
      })
      .min(1, { message: "Postal code is not allowed to be empty." })
      .max(5, {
        message: "Postal code too long. Please enter no more than 5 digit.",
      }),
  },
  { invalid_type_error: "Shipping details must be an object.", required_error: "Shipping details is required!" }
);

const orderValidation = z
  .object({
    username: z
      .string({ invalid_type_error: "Username must be a string!", required_error: "Username is required!" })
      .min(1, { message: "Username is not allowed to be empty!" }),
    guestUserId: z
      .string({ invalid_type_error: "Guest user id must be a string!", required_error: "Guest user id is required!" })
      .min(1, { message: "Guest user id not allowed to be empty" })
      .uuid({ message: "Guest user id is invalid!" }),
    orderId: z
      .string({ invalid_type_error: "Order id must be a string!", required_error: "Order id is required!" })
      .min(1, { message: "Order id not allowed to be empty" })
      .uuid({ message: "Order id is invalid!" }),
  })
  .partial();

const createOrderValidation = z
  .object({
    customerDetails: customerDetailsValidation.required(),
    shippingDetails: shippingDetailsValidation.required(),
    deliveryDetails: deliveryDetailsValidation.required(),
  })
  .extend(orderValidation.omit({ orderId: true }).shape);

const getOrderValidation = orderValidation.required({ orderId: true });

const cancelOrderValidation = orderValidation.required({ orderId: true });

const checkoutValidation = orderValidation.required({ orderId: true });

const listOrderValidation = z
  .object({
    username: z
      .string({ invalid_type_error: "Username must be a string!", required_error: "Username is required!" })
      .min(1, { message: "Username is not allowed to be empty!" }),
    guestUserId: z
      .string({ invalid_type_error: "Guest user id must be a string!", required_error: "Guest user id is required!" })
      .min(1, { message: "Guest user id not allowed to be empty" })
      .uuid({ message: "Guest user id is invalid!" }),
  })
  .partial();

export { createOrderValidation, checkoutValidation, getOrderValidation, cancelOrderValidation, listOrderValidation };
