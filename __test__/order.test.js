import { createTestUser, removeManyCartItems, removeTestUser, token, username } from "./test-util";
import { calculateTotalPrice } from "../src/utils";
import { request } from "./setup";

describe("POST /api/orders", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can create new order", async () => {
    const cart = await request.get("/api/users/current/carts").set("Authorization", token);
    const result = await request.post("/api/orders").set("Authorization", token);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe(username);
    expect(result.body.data.status).toBe("uncomplete");
    expect(result.body.data.total).toBe(calculateTotalPrice(cart.body.data.cartItems));
    expect(result.body.data.subTotal).toBe(calculateTotalPrice(cart.body.data.cartItems));
  });

  it("should reject if token is invalid", async () => {
    const result = await request.post("/api/orders").set("Authorization", "invalid-token");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if item is empty", async () => {
    await removeManyCartItems();

    const result = await request.post("/api/orders").set("Authorization", token);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});

describe("POST /api/orders/checkout", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can checkout order", async () => {
    const order = await request.post("/api/orders").set("Authorization", token);
    const result = await request.post("/api/orders/checkout").query({ id: order.body.data.id }).set("Authorization", token);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data).toHaveProperty("url");
  });

  it("should reject if token is invalid", async () => {
    const order = await request.post("/api/orders").set("Authorization", token);
    const result = await request.post("/api/orders/checkout").query({ id: order.body.data.id }).set("Authorization", "invalid-token");

    expect(result.status).toBe(401);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should return old session if not expired", async () => {
    const order = await request.post("/api/orders").set("Authorization", token);
    const oldSession = await request.post("/api/orders/checkout").query({ id: order.body.data.id }).set("Authorization", token);
    const result = await request.post("/api/orders/checkout").query({ id: order.body.data.id }).set("Authorization", token);

    expect(result.status).toBe(200);
    expect(result.body.data.sessionId).toBe(oldSession.body.data.sessionId);
    expect(result.body.data.url).toBe(oldSession.body.data.url);
    expect(result.body.data.createdAt).toBe(oldSession.body.data.createdAt);
  });
});

describe("GET /api/orders/:orderId", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get order", async () => {
    const order = await request.post("/api/orders").set("Authorization", token);
    const result = await request.get(`/api/orders/${order.body.data.id}`).set("Authorization", token);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(order.body.data.id);
    expect(result.body.data.items).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const order = await request.post("/api/orders").set("Authorization", token);
    const result = await request.get(`/api/orders/${order.body.data.id}`).set("Authorization", "invalid-token");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if order id is invalid", async () => {
    await request.post("/api/orders").set("Authorization", token);
    const result = await request.get("/api/orders/404").set("Authorization", token);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if get order from other user", async () => {
    const user = await request
      .post("/api/users")
      .send({ username: "test-order", name: "Test Order", password: "rahasia123", phonenumberForm: { number: "+6288293106563", countryId: "ID" } });
    const authUser = await request.post("/api/users/login").send({ username: user.body.data.username, password: "rahasia123" });
    const product = await request.get("/api/products/pizza-0");
    await request.put("/api/users/current/carts/items").set("Authorization", authUser.body.data.token).send({ productSlug: product.body.data.slug, quantity: 5 });
    const order = await request.post("/api/orders").set("Authorization", authUser.body.data.token);
    const result = await request.get(`/api/orders/${order.body.data.id}`).set("Authorization", token);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});

describe("POST /api/orders/:orderId/cancel", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can cancel order", async () => {
    const order = await request.post("/api/orders").set("Authorization", token);
    const result = await request.post(`/api/orders/${order.body.data.id}/cancel`).set("Authorization", token);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(order.body.data.id);
    expect(result.body.data.status).toBe("canceled");
  });

  it("should reject if token is invalid", async () => {
    const order = await request.post("/api/orders").set("Authorization", token);
    const result = await request.post(`/api/orders/${order.body.data.id}/cancel`).set("Authorization", "invalid=token");

    expect(result.status).toBe(401);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if cancel other user order", async () => {
    const user = await request
      .post("/api/users")
      .send({ username: "test-order", name: "Test Order", password: "rahasia123", phonenumberForm: { number: "+6288293106563", countryId: "ID" } });
    const authUser = await request.post("/api/users/login").send({ username: user.body.data.username, password: "rahasia123" });
    const product = await request.get("/api/products/pizza-0");
    await request.put("/api/users/current/carts/items").set("Authorization", authUser.body.data.token).send({ productSlug: product.body.data.slug, quantity: 5 });
    const order = await request.post("/api/orders").set("Authorization", authUser.body.data.token);
    const result = await request.post(`/api/orders/${order.body.data.id}/cancel`).set("Authorization", token);

    expect(result.status).toBe(404);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });
});
