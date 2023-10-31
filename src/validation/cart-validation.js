import { z } from "zod";

const getCartValidation = z.string().max(100).nonempty({ message: "Username is not allowed to be empty!" });

const cartValidation = z
  .object({
    cartItems: z.object({}).passthrough().array(),
    totalPrice: z.number({ required_error: "Total price is required!", invalid_type_error: "Total price must be a number!" }),
  })
  .partial()
  .transform((cart) => {
    const itemsProductSlug = [];

    if (Object.keys(cart).length === 0 || cart.cartItems === undefined) {
      return { cartItems: [], totalPrice: 0 };
    }

    const validCartItems = cart.cartItems.filter((item) => {
      if (
        item.quantity > 0 &&
        item.productSlug !== "" &&
        typeof item.productSlug === "string" &&
        !itemsProductSlug.includes(item.productSlug) &&
        Boolean(item.quantity) &&
        Boolean(item.productSlug)
      ) {
        itemsProductSlug.push(item.productSlug);

        return true;
      } else {
        return false;
      }
    });

    return { ...cart, cartItems: validCartItems };
  });

export { cartValidation, getCartValidation };
