import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import {
  getBestRatedValidation,
  getProductValidation,
  infiniteValidation,
  searchProductValidation,
  updateProductValidation,
} from "../validation/product-validation.js";
import validate from "../validation/validation.js";

const get = async (slug) => {
  slug = validate(getProductValidation, slug);

  const product = await prismaClient.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              username: true,
              phonenumber: true,
              profile: { select: { name: true, avatar: true } },
            },
          },
        },
      },
      likes: true,
      tags: true,
    },
  });

  if (!product) {
    throw new ResponseError(404, "Product not found!");
  }

  return product;
};

const search = async (request) => {
  request = validate(searchProductValidation, request);

  const skip = (request.page - 1) * request.size;
  const filters = [];

  if (request.name) {
    filters.push({ name: { contains: request.name } });
  }

  if (request.category) {
    filters.push({ category: { slug: { contains: request.category } } });
  }

  if (request.tag) {
    filters.push({
      tags: { some: { tag: { slug: { contains: request.tag } } } },
    });
  }

  const products = await prismaClient.product.findMany({
    where: {
      AND: filters,
    },
    include: {
      category: { select: { name: true, slug: true } },
      tags: { select: { tag: { select: { name: true, slug: true } } } },
      likes: true,
    },
    take: request.getAll ? undefined : request.size,
    skip,
  });

  const totalItems = await prismaClient.product.count({
    where: { AND: filters },
  });
  const hasNextPage = await prismaClient.product.count({ where: { AND: filters }, skip: skip + request.size }).then((result) => {
    return result > 0 && !request.getAll;
  });

  const divider = request.getAll ? totalItems : request.size;

  return {
    data: products,
    paging: {
      page: request.page,
      totalProducts: totalItems,
      totalPage: Math.ceil(totalItems / divider),
      hasNextPage,
    },
  };
};

const infinite = async (request) => {
  request = validate(infiniteValidation, request);

  const products = await prismaClient.product.findMany({
    take: request.size,
    skip: !!request.cursor ? 1 : undefined,
    cursor: request.cursor ? { id: request.cursor } : undefined,
    where: {
      name: { contains: request.name },
      category: { slug: { contains: request.category } },
      tags: { some: { tag: { slug: { contains: request.tag } } } },
    },
    include: {
      likes: true,
    },
    orderBy: { id: "asc" },
  });

  if (products.length < 1) {
    return {
      data: [],
      paging: { hasNextPage: false },
    };
  }

  const totalItems = await prismaClient.product
    .count({
      where: {
        name: { contains: request.name },
        category: { slug: { contains: request.category } },
        tags: { some: { tag: { slug: { contains: request.tag } } } },
      },
    })
    .then((result) => (!!result ? result : 0));
  const nextCursor = products.at(-1).id ?? undefined;
  const hasNextPage = await prismaClient.product
    .count({
      where: {
        name: { contains: request.name },
        category: { slug: { contains: request.category } },
        tags: { some: { tag: { slug: { contains: request.tag } } } },
      },
      cursor: { id: nextCursor },
      skip: 1,
    })
    .then((result) => {
      return result > 0;
    });

  return {
    data: products,
    paging: {
      nextCursor,
      totalProducts: totalItems,
      totalPage: Math.ceil(totalItems / request.size),
      hasNextPage,
    },
  };
};

const getBestRated = async (category) => {
  category = validate(getBestRatedValidation, category);

  return await prismaClient.product
    .findMany({
      where: { category: { slug: { contains: category } } },
      orderBy: { averageRating: "desc" },
      include: { likes: true },
    })
    .then((result) => result.slice(0, 5));
};

const update = async (request) => {
  request = validate(updateProductValidation, request);

  const product = await prismaClient.product.findUnique({
    where: { slug: request.slug },
    include: { tags: true },
  });

  if (!product) {
    throw new ResponseError(404, "Product not found!");
  }

  return prismaClient.product.update({
    where: { slug: product.slug },
    data: {
      name: request.name,
      description: request.description,
      ingredients: request.ingredients,
      price: request.price,
      category: { connect: { slug: request.categorySlug } },
      tags: {
        set: [],
        connectOrCreate: [...request.tags].map((tag) => ({
          where: { productId_tagId: { productId: product.id, tagId: tag.tagId || tag } },
          create: { tagId: tag.tagId || tag },
        })),
      },
    },
    include: { tags: true, category: true },
  });

  // prismaClient.tagOnProduct.upsert({ where: { productId_tagId: { productId: product.id } } });
};

export default { get, search, infinite, getBestRated, update };
