import { z } from "zod";

const cartIdValidation = z.coerce
  .number({ invalid_type_error: "Cart id must be number!", required_error: "Cart id is required!" })
  .positive({ message: "Cart id must be positive number!" });

const getCartItemValidation = z.string({ required_error: "Username is required!" }).max(100).nonempty({ message: "Username is not allowed to be empty!" });

const findItemValidation = z.object({
  cartId: cartIdValidation,
  productSlug: z.string({ required_error: "Product slug is required!" }).nonempty({ message: "Product slug is not allowed to be empty!" }),
});

const upsertCartItemValidation = z
  .object({
    cartId: cartIdValidation,
    productSlug: z.string({ required_error: "Product slug is required!" }).nonempty({ message: "Product slug is not allowed to be empty!" }),
    quantity: z.coerce.number({ invalid_type_error: "Quantity must be number!" }).min(1).positive({ message: "Quantity must be positive number!" }),
  })
  .strict();

const deleteItemValidation = z
  .object({
    cartId: cartIdValidation,
    itemId: z.coerce.number({ invalid_type_error: "Item id must be number!", required_error: "Item id is required!" }).min(1).positive(),
  })
  .strict();

export { getCartItemValidation, findItemValidation, upsertCartItemValidation, deleteItemValidation };
