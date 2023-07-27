import supertest from "supertest";
import { web } from "../src/app/web";
import {
  createTestUser,
  createTestProduct,
  productDescription,
  productIngredients,
  productName,
  productPrice,
  productSlug,
  removeTestProduct,
  removeTestUser,
} from "./test-util";
import { logger } from "../src/app/logging";

jest.setTimeout(60000);

beforeAll(() => {
  logger.silent = true;
});

afterAll(() => {
  logger.silent = false;
});

describe("GET /api/products/:slug", function () {
  beforeEach(async () => {
    await createTestProduct();
  });

  afterEach(async () => {
    await removeTestProduct();
  });

  it("should can get product", async () => {
    const result = await supertest(web).get(`/api/products/${productSlug}`);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe(productName);
    expect(result.body.data.slug).toBe(productSlug);
    expect(result.body.data.description).toBe(productDescription);
    expect(result.body.data.ingredients).toBe(productIngredients);
    expect(result.body.data.price).toBe(productPrice);
    expect(result.body.data.reviews).toBeDefined();
  });

  it("should reject if slug is invalid", async () => {
    const result = await supertest(web).get("/api/products/invalid-slug");

    expect(result.status).toBe(404);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/products/search", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can search products without parameters", async () => {
    const result = await supertest(web).get("/api/products/search");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
  });

  it("should can search to page 2", async () => {
    const result = await supertest(web).get("/api/products/search").query({ page: 2 });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(false);
  });

  it("should can search with size 15", async () => {
    const result = await supertest(web).get("/api/products/search").query({ size: 15 });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(15);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
  });

  it("should can search using name", async () => {
    const result = await supertest(web).get("/api/products/search").query({ name: "1" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalProducts).toBe(11);
    expect(result.body.paging.hasNextPage).toBe(true);
  });

  it("should can search using category", async () => {
    const result = await supertest(web).get("/api/products/search").query({ category: "food" });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBeDefined();
    expect(result.body.paging.totalProducts).toBeDefined();
    expect(result.body.paging.hasNextPage).toBeDefined();
  });

  it("should can search using tag", async () => {
    const result = await supertest(web).get("/api/products/search").query({ tag: "tag" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
  });

  it("should can search using tag, name, category, size, page", async () => {
    const result = await supertest(web).get("/api/products/search").query({ category: "food", name: "pizza", page: 2, size: 15, tag: "tag" });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.totalPage).toBeDefined();
    expect(result.body.paging.totalProducts).toBeDefined();
    expect(result.body.paging.hasNextPage).toBe(false);
  });
});

describe("GET /api/products", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get products", async () => {
    const result = await supertest(web).get("/api/products").query();

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });

  it("should can get products using name", async () => {
    const result = await supertest(web).get("/api/products").query({ name: "5" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(2);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBe(2);
    expect(result.body.paging.hasNextPage).toBe(false);
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });

  it("should can get products using tag", async () => {
    const result = await supertest(web).get("/api/products").query({ tag: "tag" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });

  it("should can get products using category", async () => {
    const result = await supertest(web).get("/api/products").query({ category: "foo" });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBeDefined();
    expect(result.body.paging.hasNextPage).toBeDefined();
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });

  it("should can get products using cursor", async () => {
    const product = await supertest(web).get("/api/products/pizza-5");
    const result = await supertest(web).get("/api/products").query({ cursor: product.body.data.id });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });

  it("should can get products using cursor, name, category and tag", async () => {
    const product = await supertest(web).get("/api/products/pizza-1");
    const result = await supertest(web).get("/api/products").query({ name: "1", category: "foo", tag: "tag", cursor: product.body.data.id });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBeDefined();
    expect(result.body.paging.hasNextPage).toBe(false);
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });
});

describe("GET /api/products/best-rated", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get best rated products", async () => {
    const result = await supertest(web).get("/api/products/best-rated");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBeLessThan(6);
  });

  it("should can get best rated products with category drink", async () => {
    const result = await supertest(web).get("/api/products/best-rated").query({ category: "drink" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBeLessThan(6);
  });
});
