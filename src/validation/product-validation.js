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
  id: z.coerce.number({ required_error: "Id product is required!", invalid_type_error: "Id product must be a number!" }).positive(),
  name: z.string({ required_error: "Name is required!" }).nonempty({ message: "Name is not allowed to be empty!" }),
  slug: z
    .string({ required_error: "Slug is required!" })
    .nonempty({ message: "Slug is not allowed to be empty!" })
    .refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
      message: "Product slug is invalid! Slug format should like 'pizza-pepper'",
    }),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  categorySlug: z.string({ required_error: "Category slug is required!" }).nonempty({ message: "Category slug is not allowed to be empty!" }),
  price: z.number().min(1).positive().optional(),
  tags: z
    .number({ required_error: "Tags is required!", invalid_type_error: "Tag id must be a number!" })
    .array()
    .nonempty({
      message: "Tags can't be empty!",
    })
    .transform((val) => val.map((id) => ({ id }))),
});

const createProductValidation = z
  .object({
    name: z.string({ required_error: "Name is required!" }).nonempty({ message: "Name is not allowed to be empty!" }),
    slug: z
      .string({ required_error: "Slug is required!" })
      .nonempty({ message: "Slug is not allowed to be empty!" })
      .refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
        message: "Product slug is invalid! Slug format should like 'pizza-pepper'",
      }),
    description: z.string().optional(),
    ingredients: z.string().optional(),
    categorySlug: z.string({ required_error: "Category slug is required!" }).nonempty({ message: "Category slug is not allowed to be empty!" }),
    price: z.number({ invalid_type_error: "Price must be a number!", required_error: "Price is required!" }).min(1).positive(),
    tags: z.number({ required_error: "Tags is required!", invalid_type_error: "Tag id must be a number!" }).array().nonempty({
      message: "Tags can't be empty!",
    }),
  })
  .strict();

export { createProductValidation, getProductValidation, searchProductValidation, infiniteValidation, getBestRatedValidation, updateProductValidation };
