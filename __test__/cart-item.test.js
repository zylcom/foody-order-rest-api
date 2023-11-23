import supertest from "supertest";
import { web } from "../src/app/web";
import { createTestUser, removeTestUser, token } from "./test-util";

describe("GET /api/carts/items/:productSlug", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get cart item", async () => {
    const result = await supertest(web).get("/api/carts/items/pizza-1").set("Authorization", token);

    expect(result.status).toBe(200);
    expect(result.body.data.productSlug).toBe("pizza-1");
  });

  it("should reject if product slug is invalid", async () => {
    const result = await supertest(web).get("/api/carts/items/pizza-404").set("Authorization", token);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/carts/items", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can insert cart item", async () => {
    const product = await supertest(web).get("/api/products/pizza-0");
    const result = await supertest(web).put("/api/carts/items").set("Authorization", token).send({ productSlug: product.body.data.slug, quantity: 5 });

    expect(result.status).toBe(200);
    expect(result.body.data.quantity).toBe(5);
    expect(result.body.data.productSlug).toBe(product.body.data.slug);
    expect(result.body.data.product.slug).toBe(product.body.data.slug);
  });

  it("should can update cart item", async () => {
    const product = await supertest(web).get("/api/products/pizza-0");
    await supertest(web).put("/api/carts/items").set("Authorization", token).send({ productSlug: product.body.data.slug, quantity: 5 });
    const result = await supertest(web).put("/api/carts/items").set("Authorization", token).send({ productSlug: product.body.data.slug, quantity: 10 });

    expect(result.status).toBe(200);
    expect(result.body.data.quantity).toBe(10);
    expect(result.body.data.productSlug).toBe(product.body.data.slug);
    expect(result.body.data.product.slug).toBe(product.body.data.slug);
  });

  it("should reject if quantity is float number", async () => {
    const product = await supertest(web).get("/api/products/pizza-0");
    const result = await supertest(web).put("/api/carts/items").set("Authorization", token).send({ productSlug: product.body.data.slug, quantity: 5.5 });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if token is invalid", async () => {
    const product = await supertest(web).get("/api/products/pizza-0");
    const result = await supertest(web).put("/api/carts/items").set("Authorization", "invalid-token").send({ productSlug: product.body.data.slug, quantity: 5 });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});

describe("DELETE /api/carts/items/:productSlug", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can delete cart item of current user", async () => {
    const user = await supertest(web).get("/api/users/current").set("Authorization", token);
    const result = await supertest(web).delete(`/api/carts/items/${user.body.data.cart.cartItems[0].product.slug}`).set("Authorization", token);
    const newUserData = await supertest(web).get("/api/users/current").set("Authorization", token);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(newUserData.body.data.cart.cartItems.length).toBeLessThan(user.body.data.cart.cartItems.length);
  });

  it("should reject if token is invalid", async () => {
    const user = await supertest(web).get("/api/users/current").set("Authorization", token);
    const result = await supertest(web).delete(`/api/carts/items/${user.body.data.cart.cartItems[0].id}`).set("Authorization", "invalid-token");
    const newUserData = await supertest(web).get("/api/users/current").set("Authorization", token);

    expect(result.status).toBe(401);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
    expect(newUserData.body.data.cart.cartItems.length).toBe(user.body.data.cart.cartItems.length);
  });

  it("should reject if item id is invalid", async () => {
    const user = await supertest(web).get("/api/users/current").set("Authorization", token);
    const result = await supertest(web).delete("/api/carts/items/404").set("Authorization", token);
    const newUserData = await supertest(web).get("/api/users/current").set("Authorization", token);

    expect(result.status).toBe(404);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
    expect(newUserData.body.data.cart.cartItems.length).toBe(user.body.data.cart.cartItems.length);
  });
});
