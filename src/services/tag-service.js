import validate from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import { getTagByCategoryValidation } from "../validation/tag-validation.js";

const get = () => {
  return prismaClient.tag.findMany({});
};

const getByCategory = (category) => {
  category = validate(getTagByCategoryValidation, category);

  return prismaClient.tag.findMany({ where: { products: { some: { categorySlug: category } } } });
};

export default { get, getByCategory };
