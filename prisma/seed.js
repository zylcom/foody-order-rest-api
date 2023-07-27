import { genSaltSync, hashSync } from "bcrypt";
import { faker } from "@faker-js/faker";
import { generateUniqueRandomId, randomizeLikeProduct, randomizeReviewProduct } from "../src/utils/index.js";
import { prismaClient } from "../src/app/database.js";

const saltRounds = 10;
const salt = genSaltSync(saltRounds);
const password_hash = hashSync("rahasia123", salt);

const createUserCount = 100;

const categories = [
  { id: 1, name: "Food", slug: "food" },
  { id: 2, name: "Drink", slug: "drink" },
];
const tags = [
  { id: 1, name: "Coffee", slug: "coffee" },
  { id: 2, name: "Tea", slug: "tea" },
  { id: 3, name: "Sushi", slug: "sushi" },
  { id: 4, name: "Milk", slug: "milk" },
  { id: 5, name: "Juice", slug: "juice" },
  { id: 6, name: "Cocktail", slug: "cocktail" },
  { id: 7, name: "Egg", slug: "egg" },
  { id: 8, name: "Salad", slug: "salad" },
  { id: 9, name: "Cheese", slug: "cheese" },
  { id: 10, name: "Fish", slug: "fish" },
  { id: 11, name: "Soup", slug: "soup" },
  { id: 12, name: "Vegetable", slug: "vegetable" },
  { id: 13, name: "Cake", slug: "cake" },
  { id: 14, name: "Mushroom", slug: "mushroom" },
  { id: 15, name: "Pizza", slug: "pizza" },
  { id: 16, name: "Bean", slug: "bean" },
  { id: 17, name: "Yam", slug: "yam" },
  { id: 18, name: "Potato", slug: "potato" },
  { id: 19, name: "Bread", slug: "bread" },
  { id: 20, name: "Pie", slug: "pie" },
  { id: 21, name: "Spaghetti", slug: "spaghetti" },
  { id: 22, name: "Eel", slug: "eel" },
  { id: 23, name: "Pudding", slug: "pudding" },
  { id: 24, name: "Burger", slug: "burger" },
  { id: 25, name: "Ginger", slug: "ginger" },
  { id: 26, name: "Wine", slug: "wine" },
];
const users = [
  {
    id: 2,
    username: "sabil.dev",
    phonenumber: "0898-7654-3210",
    password: password_hash,
    profile: {
      create: {
        name: "Sabilillah",
        avatar: faker.internet.avatar(),
        address: "Indonesia",
      },
    },
  },
];

for (let index = 3; index <= createUserCount; index++) {
  users.push({
    id: index,
    username: faker.internet.userName(),
    phonenumber: faker.phone.number(),
    password: password_hash,
    profile: {
      create: {
        name: faker.person.fullName(),
        avatar: faker.internet.avatar(),
        address: faker.location.country(),
      },
    },
  });
}

async function productsData() {
  return [
    {
      name: "Cappuccino",
      slug: "cappuccino",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Coffee, milk.",
      description: "It's cool and refreshing.",
      category: { connect: { id: 2 } },
      tags: {
        create: [{ tag: { connect: { id: 1 } } }, { tag: { connect: { id: 4 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fried Egg",
      slug: "fried-egg",
      price: 8500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Egg.",
      category: { connect: { id: 1 } },
      description: "Sunny-side up.",
      tags: {
        create: [{ tag: { connect: { id: 7 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Omelet",
      slug: "omelet",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Egg, milk",
      category: { connect: { id: 1 } },
      description: "It's super fluffy.",
      tags: {
        create: [{ tag: { connect: { id: 7 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Salad",
      slug: "salad",
      price: 9500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Leek, dandelion, vinegar.",
      category: { connect: { id: 1 } },
      description: "A healthy garden salad.",
      tags: {
        create: [{ tag: { connect: { id: 8 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Cheese Cauliflower",
      slug: "cheese-cauliflower",
      price: 8000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Cauliflower, cheese.",
      category: { connect: { id: 1 } },
      description: "It smells great!",
      tags: {
        create: [{ tag: { connect: { id: 9 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Baked Fish",
      slug: "baked-fish",
      price: 8500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Sunfish, bream fish, wheat flour.",
      category: { connect: { id: 1 } },
      description: "Baked fish on a bed of herbs.",
      tags: {
        create: [{ tag: { connect: { id: 10 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Parsnip Soup",
      slug: "parsnip-soup",
      price: 7500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Parsnip, milk, vinegar.",
      category: { connect: { id: 1 } },
      description: "It's fresh and hearty.",
      tags: {
        create: [{ tag: { connect: { id: 11 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Vegetable Medley",
      slug: "vegetable-medley",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Tomato, beet.",
      category: { connect: { id: 1 } },
      description: "This is very nutritious.",
      tags: {
        create: [{ tag: { connect: { id: 12 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Complete Breakfast",
      slug: "complete-breakfast",
      price: 15000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Fried egg, milk, hashbrowns.",
      category: { connect: { id: 1 } },
      description: "You'll feel ready to take on the world!",
      tags: {
        create: [{ tag: { connect: { id: 7 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fried Calamari",
      slug: "fried-calamari",
      price: 12000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Squid, wheat flour, oil.",
      category: { connect: { id: 1 } },
      description: "It's so chewy.",
      tags: {
        create: [{ tag: { connect: { id: 10 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Strange Bun",
      slug: "strange-bun",
      price: 8500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Wheat flour, periwinkle, void mayonnaise.",
      category: { connect: { id: 1 } },
      description: "What's inside?",
      tags: {
        create: [{ tag: { connect: { id: 13 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fried Mushroom",
      slug: "fried-mushroom",
      price: 7500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Common mushroom, morel, oil.",
      category: { connect: { id: 1 } },
      description: "Earthy and aromatic.",
      tags: {
        create: [{ tag: { connect: { id: 14 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pizza",
      slug: "pizza",
      price: 9000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Wheat flour, tomato, cheese.",
      category: { connect: { id: 1 } },
      description: "It's popular for all the right reasons.",
      tags: {
        create: [{ tag: { connect: { id: 15 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Bean Hotpot",
      slug: "bean-hotpot",
      price: 7500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Green bean.",
      category: { connect: { id: 1 } },
      description: "It sure is healthy.",
      tags: {
        create: [{ tag: { connect: { id: 16 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Glazed Yams",
      slug: "glazed-yams",
      price: 6000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Yam, sugar.",
      category: { connect: { id: 1 } },
      description: "Sweet and satisfying... The sugar gives it a hint of caramel.",
      tags: {
        create: [{ tag: { connect: { id: 17 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Carp Surprise",
      slug: "carp-surprise",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Carp.",
      category: { connect: { id: 1 } },
      description: "It's bland and oily.",
      tags: {
        create: [{ tag: { connect: { id: 10 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Hashbrowns",
      slug: "hashbrowns",
      price: 8000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Potato, oil.",
      category: { connect: { id: 1 } },
      description: "Crispy and golden-brown!",
      tags: {
        create: [{ tag: { connect: { id: 18 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pancakes",
      slug: "pancakes",
      price: 7000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Wheat flour, egg.",
      category: { connect: { id: 1 } },
      description: "A double stack of fluffy, soft pancakes.",
      tags: {
        create: [{ tag: { connect: { id: 13 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Salmon Dinner",
      slug: "salmon-dinner",
      price: 8000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Salmon, amaranth, kale.",
      category: { connect: { id: 1 } },
      description: "The lemon spritz makes it special.",
      tags: {
        create: [{ tag: { connect: { id: 10 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fish Taco",
      slug: "fish-taco",
      price: 7500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Tuna, tortilla, red cabbage, mayonnaise.",
      category: { connect: { id: 1 } },
      description: "It smells delicious.",
      tags: {
        create: [{ tag: { connect: { id: 10 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Crispy Bass",
      slug: "crispy-bass",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Largemouth bass, wheat flour, oil.",
      category: { connect: { id: 1 } },
      description: "Wow, the breading is perfect.",
      tags: {
        create: [{ tag: { connect: { id: 10 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pepper Poppers",
      slug: "pepper-poppers",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Hot pepper, cheese.",
      category: { connect: { id: 1 } },
      description: "Spicy breaded peppers filled with cheese.",
      tags: {
        create: [{ tag: { connect: { id: 9 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Bread",
      slug: "bread",
      price: 5000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Wheat flour.",
      category: { connect: { id: 1 } },
      description: "A crusty baguette.",
      tags: {
        create: [{ tag: { connect: { id: 19 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Tom Kha Soup",
      slug: "tom-kha-soup",
      price: 12000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Coconut, shrimp, common mushroom.",
      category: { connect: { id: 1 } },
      description: "These flavors are incredible!",
      tags: {
        create: [{ tag: { connect: { id: 11 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Chocolate Cake",
      slug: "chocolate-cake",
      price: 15000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Wheat flour, egg, sugar, cocoa powder.",
      category: { connect: { id: 1 } },
      description: "Rich and moist with a thick fudge icing.",
      tags: {
        create: [{ tag: { connect: { id: 13 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pink Cake",
      slug: "pink-cake",
      price: 15000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Melon, wheat flour, sugar, egg.",
      category: { connect: { id: 1 } },
      description: "There's little heart candies on top.",
      tags: {
        create: [{ tag: { connect: { id: 13 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Rhubarb Pie",
      slug: "rhubarb-pie",
      price: 12000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Rhubarb, wheat flour, sugar.",
      category: { connect: { id: 1 } },
      description: "Mmm, tangy and sweet!",
      tags: {
        create: [{ tag: { connect: { id: 20 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Cookie",
      slug: "cookie",
      price: 6000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Wheat flour, sugar, egg.",
      category: { connect: { id: 1 } },
      description: "Very chewy.",
      tags: {
        create: [{ tag: { connect: { id: 13 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Spaghetti",
      slug: "spaghetti",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Wheat flour, tomato.",
      category: { connect: { id: 1 } },
      description: "An old favorite.",
      tags: {
        create: [{ tag: { connect: { id: 21 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fried Eel",
      slug: "fried-eel",
      price: 11000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Ell, oil.",
      category: { connect: { id: 1 } },
      description: "Greasy but flavorful.",
      tags: {
        create: [{ tag: { connect: { id: 22 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Spicy Eel",
      slug: "spicy-eel",
      price: 11000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Eel, hot pepper, oil.",
      category: { connect: { id: 1 } },
      description: "It's really spicy! Be careful.",
      tags: {
        create: [{ tag: { connect: { id: 22 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Red Plate",
      slug: "red-plate",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Red cabbage, radish.",
      category: { connect: { id: 1 } },
      description: "Full of antioxidants.",
      tags: {
        create: [{ tag: { connect: { id: 12 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Eggplant Parmesan",
      slug: "eggplant-parmesan",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Eggplant, tomato.",
      category: { connect: { id: 1 } },
      description: "Tangy, cheesy, and wonderful.",
      tags: {
        create: [{ tag: { connect: { id: 12 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Rice Pudding",
      slug: "rice-pudding",
      price: 8000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Milk, sugar, rice.",
      category: { connect: { id: 1 } },
      description: "It's creamy, sweet, and fun to eat.",
      tags: {
        create: [{ tag: { connect: { id: 23 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Survival Burger",
      slug: "survival-burger",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Bread, cave carrot, eggplant.",
      category: { connect: { id: 1 } },
      description: "A convenient snack for the explorer.",
      tags: {
        create: [{ tag: { connect: { id: 24 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pumpkin Soup",
      slug: "pumpkin-soup",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Pumpkin, milk.",
      category: { connect: { id: 1 } },
      description: "A seasonal favorite.",
      tags: {
        create: [{ tag: { connect: { id: 11 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Trout Soup",
      slug: "trout-soup",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Rainbow trout, green algae.",
      category: { connect: { id: 1 } },
      description: "Pretty salty.",
      tags: {
        create: [{ tag: { connect: { id: 11 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Algae Soup",
      slug: "algae-soup",
      price: 8000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Green algae.",
      category: { connect: { id: 1 } },
      description: "It's a little slimy.",
      tags: {
        create: [{ tag: { connect: { id: 11 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Plum Pudding",
      slug: "plum-pudding",
      price: 7500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Wild plum, wheat flour, sugar.",
      category: { connect: { id: 1 } },
      description: "A traditional holiday treat.",
      tags: {
        create: [{ tag: { connect: { id: 23 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pumpkin Pie",
      slug: "pumpkin-pie",
      price: 7000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "",
      category: { connect: { id: 1 } },
      description: "Silky pumpkin cream in a flakey crust.",
      tags: {
        create: [{ tag: { connect: { id: 20 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Radish Salad",
      slug: "radish-salad",
      price: 8500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Oil, vinegar, radish.",
      category: { connect: { id: 1 } },
      description: "The radishes are so crisp!",
      tags: {
        create: [{ tag: { connect: { id: 8 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Seafoam Pudding",
      slug: "seafoam-pudding",
      price: 8000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Flounder, midnight carp, squid ink.",
      category: { connect: { id: 1 } },
      description: "This briny pudding will really get you into the maritime mindset!",
      tags: {
        create: [{ tag: { connect: { id: 23 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fruit Salad",
      slug: "fruit-salad",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Blueberry, melon, apricot.",
      category: { connect: { id: 1 } },
      description: "A delicious combination of summer fruits.",
      tags: {
        create: [{ tag: { connect: { id: 8 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fiddlehead Risotto",
      slug: "fiddlehead-risotto",
      price: 10000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Oil, fiddlehead fern, garlic.",
      category: { connect: { id: 1 } },
      description: "A creamy rice dish served with sauteed fern heads. It's a little bland.",
      tags: {
        create: [{ tag: { connect: { id: 12 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Triple Shot Espresso",
      slug: "triple-shot-espresso",
      price: 4500,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Coffee",
      category: { connect: { id: 2 } },
      description: "It's more potent than regular coffee!",
      tags: {
        create: [{ tag: { connect: { id: 1 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Shrimp Cocktail",
      slug: "shrimp-cocktail",
      price: 5000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Tomato, shrimp, wild horseradish.",
      category: { connect: { id: 2 } },
      description: "A sumptuous appetizer made with freshly-caught shrimp.",
      tags: {
        create: [{ tag: { connect: { id: 6 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Ginger Ale",
      slug: "ginger-ale",
      price: 5000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Ginger, sugar.",
      category: { connect: { id: 2 } },
      description: "A zesty soda known for its soothing effect on the stomach.",
      tags: {
        create: [{ tag: { connect: { id: 25 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Wine",
      slug: "wine",
      price: 15000,
      image: "https://picsum.photos/1920/1280.webp?random",
      ingredients: "Grape.",
      category: { connect: { id: 2 } },
      description: "Drink in moderation.",
      tags: {
        create: [{ tag: { connect: { id: 26 } } }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
  ];
}

async function main() {
  const categoryCount = await prismaClient.category.createMany({ data: categories });
  const tagCount = await prismaClient.tag.createMany({ data: tags });

  await prismaClient.user.create({
    data: {
      id: 1,
      username: "zylcom.dev",
      phonenumber: "0812-3456-7890",
      password: password_hash,
      profile: {
        create: {
          name: "Zylcom",
          avatar: faker.internet.avatar(),
          address: "Indonesia",
        },
      },
      cart: { create: { id: 1 } },
    },
    include: { cart: { include: { cartItems: true } } },
  });
  users.forEach(async (user) => {
    const result = await prismaClient.user.create({ data: { ...user, cart: { create: {} } }, include: { cart: { include: { cartItems: true } } } });

    console.log(result);
  });

  Promise.all([categoryCount, tagCount])
    .then(async (values) => {
      console.log(values);

      const products = await productsData();

      return await Promise.all(
        products.map(async (product) => {
          const sumRating = product.reviews.create.reduce((acc, review) => acc + review.rating, 0);

          return await prismaClient.product.create({
            data: {
              name: product.name,
              slug: product.slug,
              price: product.price,
              ingredients: product.ingredients,
              description: product.description,
              category: product.category,
              tags: product.tags,
              reviews: product.reviews,
              likes: product.likes,
              averageRating: !!sumRating ? sumRating / product.reviews.create.length : null,
            },
          });
        })
      );
    })
    .then(async (result) => {
      console.log(result);

      let totalPrice = 0;

      for (let index = 0; index < Math.floor(Math.random() * 48 + 1); index++) {
        const products = await productsData();
        const randomUniqueID = generateUniqueRandomId(47);
        const result = await prismaClient.cartItem.upsert({
          update: { cart: { connect: { id: 1 } }, product: { connect: { slug: products[randomUniqueID].slug } }, quantity: Math.floor(Math.random() * 999) },
          create: { cart: { connect: { id: 1 } }, product: { connect: { slug: products[randomUniqueID].slug } }, quantity: Math.floor(Math.random() * 999) },
          where: { item: { productSlug: products[randomUniqueID].slug, cartId: 1 } },
          include: { cart: { include: { cartItems: true } }, product: true },
        });

        totalPrice += result.quantity * result.product.price;

        console.log(result);
      }

      await prismaClient.cart.update({ where: { id: 1 }, data: { totalPrice } });

      console.log("Successfully seeded database. Closing connection.");
    });
}

main()
  .catch(async (e) => {
    console.error(`There was an error while seeding: ${e}`);

    await prismaClient.$disconnect();

    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
