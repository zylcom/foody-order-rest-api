import { isValidPhoneNumber } from "libphonenumber-js";
import { validate } from "uuid";
import { z } from "zod";

const usernameValidation = z
  .string({ required_error: "Username is required!", invalid_type_error: "Username must be a string!" })
  .max(100)
  .nonempty({ message: "Username is not allowed to be empty!" });

const userData = z
  .object({
    id: z.coerce.number().min(1).positive(),
    avatar: z.string().max(100),
    name: z.string().max(100).nonempty({ message: "Name is not allowed to be empty!" }),
    phonenumberForm: z
      .object({
        number: z
          .string({ invalid_type_error: "Phone number must be a string!", required_error: "Phone number is required!" })
          .min(10, { message: "Phone number must be 10 or more characters long" })
          .max(25, { message: "Phone number must be 25 or fewer characters long" }),
        countryCode: z
          .string({ invalid_type_error: "Country code must be a string!", required_error: "Country code is required!" })
          .nonempty({ message: "Country code is not allowed to be empty!" })
          .default("ID"),
      })
      .refine((data) => isValidPhoneNumber(data.number, data.countryCode), { message: "Phone number is invalid!" }),
    username: usernameValidation,
    password: z.string().nonempty({ message: "Password is not allowed to be empty!" }),
  })
  .partial()
  .strict();

const registerUserValidation = userData.required({ name: true, username: true, password: true, phonenumberForm: true });

const loginUserValidation = userData.required({ username: true, password: true });

const getUserValidation = z
  .string({ required_error: "Token is required!", invalid_type_error: "Token must be a string!" })
  .nonempty({ message: "Token is not allowed to be empty!" })
  .refine((val) => validate(val), { message: "Token is invalid!" });

const updateUserValidation = userData.required({ id: true });

export { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation, usernameValidation };
