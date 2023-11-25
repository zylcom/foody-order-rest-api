import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

const usernameValidation = z
  .string({ invalid_type_error: "Username must be a string!", required_error: "Username is required!" })
  .max(100, { message: "Your username is too long. Please enter no more than 100 characters!" })
  .min(3, { message: "Your username must be at least 3 characters!" });

const userData = z
  .object({
    id: z.coerce.number({ invalid_type_error: "User id must be a number!", required_error: "User id is required!" }),
    avatar: z
      .string({ invalid_type_error: "Avatar must be a string!" })
      .max(100, { message: "Your avatar url is too long. Please enter no more than 100 characters!" })
      .default("avatar-default.jpg"),
    name: z
      .string({ invalid_type_error: "Name must be a string!", required_error: "Name is required!" })
      .max(100, { message: "Your name is too long. Please enter no more than 100 characters!" })
      .min(1, { message: "Your name must be at least 1 characters!" }),
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
            .default("ID"),
        },
        { invalid_type_error: "Phone number form must be an object!", required_error: "Phone number form is required!" }
      )
      .refine((data) => isValidPhoneNumber(data.number, data.countryCode), { message: "Phone number is invalid!" }),
    username: usernameValidation,
    password: z
      .string({ invalid_type_error: "Password must be a string!", required_error: "Password is required!" })
      .min(8, { message: "Your password must be at least 8 characters!" }),
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
