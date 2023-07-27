import { faker } from "@faker-js/faker";
import { prismaClient } from "../app/database.js";

const generatedId = [];

function generateUniqueRandomId(max) {
  let randomId;

  // Keep generating random id until we find one that is unique
  do {
    randomId = Math.floor(Math.random() * max) + 1; // Generate a random id between 1 and 100
  } while (generatedId.includes(randomId)); // Check if the id has been generated before

  // Add the id to the generated id array
  generatedId.push(randomId);

  return randomId;
}

async function randomizeLikeProduct(max) {
  const data = [];

  for (let index = 0; index < Math.floor(Math.random() * max); index++) {
    const user = await prismaClient.user.findUnique({ where: { id: generateUniqueRandomId(max) } });

    data.push({ user: { connect: { username: user.username } } });
  }

  generatedId.length = 0;

  return data;
}

async function randomizeReviewProduct(max) {
  const data = [];

  for (let index = 0; index < Math.floor(Math.random() * max); index++) {
    const user = await prismaClient.user.findUnique({ where: { id: generateUniqueRandomId(max) } });

    data.push({
      description: faker.lorem.sentence(),
      rating: Math.floor(Math.random() * 5) + 1,
      user: { connect: { username: user.username } },
    });
  }

  generatedId.length = 0;

  return data;
}

function calculateTotalPrice(items) {
  return items.reduce((acc, item) => {
    return acc + item.quantity * item.product.price;
  }, 0);
}

export { calculateTotalPrice, generateUniqueRandomId, randomizeLikeProduct, randomizeReviewProduct };
