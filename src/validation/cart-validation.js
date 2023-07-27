import { z } from "zod";

const getCartValidation = z.string().max(100).nonempty({ message: "Username is not allowed to be empty!" });

export { getCartValidation };
