import bcrypt from "bcrypt";
import { prismaClient } from "../src/app/database";
import { calculateTotalPrice } from "../src/utils";

const username = "test-user";
const name = "Test User";
const password = "rahasia123";
const phonenumberForm = { number: "+6283806163238", countryId: "ID" };
const invalidToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inp5bGNvbS5kZXYiLCJpYXQiOjE3MDEwNjQyMDYsImV4cCI6MTcwMTA2NjAwNn0.QMRsgyCX8MRqj0wv4CpQn0nD3jv6mSw-eUyyDblQjZo";
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
const shippingDetails = {
  address: "adres",
  detail: "home detail",
  city: "jkbar",
  state: "Jkt",
  postalCode: "11224",
};
const deliveryDetails = {
  method: "express",
  cost: 5000,
};

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

  await prismaClient.payment.deleteMany({});
  await prismaClient.orderItem.deleteMany({});
  await prismaClient.shipment.deleteMany({});
  await prismaClient.order.deleteMany({});
  await prismaClient.cart.deleteMany({});
  await prismaClient.profile.deleteMany({});
  await prismaClient.user.deleteMany({});
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
      tags: { connect: tagsProduct.map((tag) => ({ id: tag.id })) },
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
        tags: { connect: { id: Math.floor(Math.random() * 3) + 1 } },
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

const createPaymentTest = async () => {
  await prismaClient.order.create({
    data: {
      id: "76a1b635-5964-462d-a224-3a42008d9abb",
      subTotal: 167500,
      total: 167500,
      name,
      phone: phonenumberForm.number,
      user: { connect: { username } },
      items: { create: [{ price: 167500, productName: "Pizza-1", quantity: 1, product: { connect: { slug: "pizza-1" } } }] },
      status: "complete",
      shipment: {
        create: {
          ...shippingDetails,
          ...deliveryDetails,
          name,
          phone: phonenumberForm.number,
        },
      },
      payment: {
        create: {
          amount: 167500,
          currency: "IDR",
          signatureKey: "1753c8db0376d14e8d92ab14cc8a0b781f935e92e7ba848388e63c276403bb749a0bad9d34e61b3bfbeacb481658ce5e8edb1a98d642d540c5091fe961da9d54",
          method: "alfamart",
          username,
          name,
          status: "paid",
        },
      },
    },
  });
};

const removePaymentTest = async () => {
  await prismaClient.payment.deleteMany({});
  await prismaClient.shipment.deleteMany({});
  await prismaClient.orderItem.deleteMany({});
  await prismaClient.order.deleteMany({});
};

export {
  createManyTestProducts,
  createPaymentTest,
  createTestCategory,
  createTestProduct,
  createTestUser,
  getTestUser,
  invalidToken,
  name,
  password,
  phonenumberForm,
  productDescription,
  productName,
  productIngredients,
  productPrice,
  productSlug,
  removeManyCartItems,
  removePaymentTest,
  removeTestCategory,
  removeTestProduct,
  removeTestUser,
  removeTestReview,
  username,
};
