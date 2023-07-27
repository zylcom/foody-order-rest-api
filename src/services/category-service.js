import { prismaClient } from "../app/database.js";

const get = async () => {
  const category = await prismaClient.category.findMany({});

  return category;
};

export default { get };
