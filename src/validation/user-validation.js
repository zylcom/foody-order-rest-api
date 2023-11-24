import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

const usernameValidation = z
  .string({ invalid_type_error: "Username must be a string!", required_error: "Username is required!" })
  .max(100, { message: "Username is to long!" })
  .min(3, { message: "Username is to short!" });

const userData = z
  .object({
    id: z.coerce
      .number({ invalid_type_error: "User id must be a number!", required_error: "User id is required!" })
      .gt(0, { message: "User id must greater than 0" })
      .positive({ message: "User id must be a positive number!" }),
    avatar: z.string({ invalid_type_error: "Avatar must be a string!" }).max(100, { message: "Avatar is to long. (max 100)" }).default("avatar-default.jpg"),
    name: z
      .string({ invalid_type_error: "Name must be a string!", required_error: "Name is required!" })
      .max(100, { message: "Name is to long" })
      .min(1, { message: "Name is not allowed to be empty!" }),
    phonenumberForm: z
      .object({
        number: z
          .string({ invalid_type_error: "Phone number must be a string!", required_error: "Phone number is required!" })
          .min(10, { message: "Phone number must be 10 or more characters long" })
          .max(25, { message: "Phone number must be 25 or fewer characters long" }),
        countryCode: z
          .string({ invalid_type_error: "Country code must be a string!", required_error: "Country code is required!" })
          .min(1, { message: "Country code is not allowed to be empty!" })
          .default("ID"),
      })
      .refine((data) => isValidPhoneNumber(data.number, data.countryCode), { message: "Phone number is invalid!" }),
    username: usernameValidation,
    password: z
      .string({ invalid_type_error: "Password must be a string!", required_error: "Password is required!" })
      .min(8, { message: "Password length must be 8 or more!" }),
  })
  .partial()
  .strict();

const registerUserValidation = userData.required({ name: true, username: true, password: true, phonenumberForm: true });

const loginUserValidation = userData.required({ username: true, password: true });

const getUserValidation = z
  .string({ invalid_type_error: "Token must be a string!", required_error: "Token is required!" })
  .min(1, { message: "Token is not allowed to be empty!" })
  .uuid({ message: "Token is invalid!" });

const updateUserValidation = userData.required({ id: true });

export { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation, usernameValidation };
