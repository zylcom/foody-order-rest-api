import bcrypt from "bcrypt";
import { prismaClient } from "../src/app/database";
import { calculateTotalPrice } from "../src/utils";

const username = "test-user";
const name = "Test User";
const password = "rahasia";
const phonenumberForm = { number: "+6283806163238", countryId: "ID" };
const token = "test-token";
const productName = "Pizza";
const productPrice = 10_000;
const productSlug = "pizza";
const productDescription = "It's popular for all the right reasons.";
const productIngredients = "Wheat flour, tomato, cheese.";
const tagsProduct = [
  { id: 1, name: "Tag 1", slug: "tag-1" },
  { id: 2, name: "Tag 2", slug: "tag-2" },
  { id: 3, name: "Tag 3", slug: "tag-3" },
];

const createManyCartItems = () => {
  let items = [];
  for (let i = 1; i <= Math.floor(Math.random() * 20 + 1); i++) {
    items.push({ quantity: i, product: { connect: { slug: productSlug + "-" + i } } });
  }

  return items;
};

const removeManyCartItems = async () => {
  await prismaClient.cartItem.deleteMany({ where: { cart: { username } } });
};

const createTestUser = async () => {
  const hashPassword = await bcrypt.hash(password, 10);

  await prismaClient.user.create({
    data: {
      username,
      password: hashPassword,
      phonenumber: phonenumberForm.number,
      token,
      profile: { create: { name } },
    },
  });

  await createManyTestProducts();

  const user = await prismaClient.user.update({
    where: { username },
    data: {
      cart: { create: { cartItems: { create: createManyCartItems() } } },
    },
    include: { cart: { include: { cartItems: { include: { product: true } } } } },
  });

  await prismaClient.cart.update({ where: { username }, data: { totalPrice: calculateTotalPrice(user.cart.cartItems) } });
};

const removeTestUser = async () => {
  await removeTestProduct();
  await removeManyCartItems();

  await prismaClient.checkoutSession.deleteMany({});
  await prismaClient.orderItem.deleteMany({});
  await prismaClient.order.deleteMany({});
  await prismaClient.cart.deleteMany({ where: { user: { username } } });
  await prismaClient.profile.deleteMany({ where: { user: { username } } });
  await prismaClient.user.deleteMany({ where: { username } });
};

const getTestUser = async () => {
  return prismaClient.user.findUnique({ where: { username } });
};

const createTestCategory = () => {
  return prismaClient.category.createMany({
    data: [
      { id: 1, name: "Food", slug: "food" },
      { id: 2, name: "Drink", slug: "drink" },
    ],
  });
};

const removeTestCategory = async () => {
  await prismaClient.category.deleteMany({});
};

const createManyTestTags = async () => {
  await prismaClient.tag.createMany({ data: tagsProduct });
};

const removeTestTag = async () => {
  await prismaClient.tag.deleteMany({});
};

const createTestProduct = async () => {
  await createTestCategory();
  await createManyTestTags();

  await prismaClient.product.create({
    data: {
      category: { connect: { id: 1 } },
      name: productName,
      price: productPrice,
      slug: productSlug,
      description: productDescription,
      ingredients: productIngredients,
      tags: { create: tagsProduct.map((tag) => ({ tag: { connect: { id: tag.id } } })) },
    },
  });
};

const createManyTestProducts = async () => {
  await createTestCategory();
  await createManyTestTags();

  const user = await prismaClient.user.create({ data: { password: "", username: "test_user_1", phonenumber: "" } });

  for (let i = 0; i < 20; i++) {
    await prismaClient.product.create({
      data: {
        name: productName + " " + i,
        price: productPrice + i,
        slug: productSlug + "-" + i,
        description: productDescription + " " + i,
        ingredients: productIngredients + " " + i,
        category: { connect: { id: Math.floor(Math.random() * 2) + 1 } },
        tags: { create: { tag: { connect: { id: Math.floor(Math.random() * 3) + 1 } } } },
        averageRating: Math.random() * 4 + 1,
        likes: { create: { user: { connect: { username: user.username } } } },
      },
    });
  }
};

const removeTestProduct = async () => {
  await prismaClient.likeOnProduct.deleteMany({});
  await prismaClient.review.deleteMany({});
  await prismaClient.cartItem.deleteMany({});
  await prismaClient.tagOnProduct.deleteMany({});
  await prismaClient.user.deleteMany({ where: { username: "test_user_1" } });
  await prismaClient.product.deleteMany({});
  await removeTestCategory();
  await removeTestTag();
};

const removeTestReview = async () => {
  await prismaClient.review.deleteMany({});
};

export {
  name,
  password,
  phonenumberForm,
  productDescription,
  productName,
  productIngredients,
  productPrice,
  productSlug,
  token,
  username,
  createManyTestProducts,
  createTestCategory,
  createTestProduct,
  createTestUser,
  getTestUser,
  removeManyCartItems,
  removeTestCategory,
  removeTestProduct,
  removeTestUser,
  removeTestReview,
};
