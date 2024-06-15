import validate from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import { filterValidation } from "../validation/tag-validation.js";

const get = (filter) => {
  filter = validate(filterValidation, filter);

  return prismaClient.tag.findMany({ where: { products: { some: { categorySlug: { contains: filter.categorySlug, mode: "insensitive" } } } } });
};

export default { get };
