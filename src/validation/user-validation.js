import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

const userData = z
  .object({
    id: z.coerce.number().min(1).positive(),
    avatar: z.string().max(100),
    name: z.string().max(100).nonempty({ message: "Name is not allowed to be empty!" }),
    phonenumberForm: z
      .object({
        number: z.string().min(10).max(14),
        countryCode: z.string().nonempty({ message: "Country code is not allowed to be empty!" }).default("ID"),
      })
      .refine((data) => isValidPhoneNumber(data.number, data.countryCode), { message: "Phone number is invalid!" }),
    username: z.string().max(100).nonempty({ message: "Username is not allowed to be empty!" }),
    password: z.string().nonempty({ message: "Password is not allowed to be empty!" }),
  })
  .partial()
  .strict();

const registerUserValidation = userData.required({ name: true, username: true, password: true, phonenumberForm: true });

const loginUserValidation = userData.required({ username: true, password: true });

const getUserValidation = z.string().max(100).nonempty({ message: "Username is not allowed to be empty!" });

const updateUserValidation = userData.required({ id: true });

export { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation };
