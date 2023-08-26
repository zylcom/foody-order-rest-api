import { z } from "zod";

const getProductValidation = z.string().max(100).nonempty({ message: "Slug is not allowed to be empty!" });

const searchProductValidation = z
  .object({
    category: z.string().default(""),
    name: z.string().default(""),
    tag: z.string().default(""),
    page: z.coerce.number({ invalid_type_error: "Page must be number!" }).min(1).positive().default(1),
    size: z.coerce.number({ invalid_type_error: "Size must be number!" }).min(1).max(100).positive().default(10),
    getAll: z.boolean({ invalid_type_error: "Get all must be a boolean!" }).default(false),
  })
  .strict();

const infiniteValidation = z
  .object({
    category: z.string().default(""),
    name: z.string().default(""),
    tag: z.string().default(""),
    size: z.coerce.number({ invalid_type_error: "Size must be number!" }).min(1).max(100).positive().default(10),
    cursor: z.coerce.number({ invalid_type_error: "Cursor must be number!" }).positive().optional(),
  })
  .strict();

const getBestRatedValidation = z.string({ required_error: "Category is required!" }).max(100).default("");

const updateProductValidation = z.object({
  name: z.string({ required_error: "Name is required!" }).nonempty({ message: "Name is not allowed to be empty!" }),
  slug: z.string({ required_error: "Slug is required!" }).nonempty({ message: "Slug is not allowed to be empty!" }),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  categorySlug: z.string({ required_error: "Category slug is required!" }).nonempty({ message: "Slug is not allowed to be empty!" }),
  price: z.number().min(1).positive().optional(),
  tags: z.number({ required_error: "Tags is required!", invalid_type_error: "Tag id must be a number!" }).array().nonempty({
    message: "Tags can't be empty!",
  }),
});

export { getProductValidation, searchProductValidation, infiniteValidation, getBestRatedValidation, updateProductValidation };
