import { createTestUser, invalidToken, password, removeManyCartItems, removeTestUser, username } from "./test-util";
import { calculateTotalPrice } from "../src/utils";
import { request } from "./setup";
import { validate } from "uuid";

const customerDetails = {
  name: "Zylcom",
  phonenumberForm: {
    number: "000000000000",
    countryCode: "ID",
  },
};

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

describe("POST /api/orders", function () {
  let token;

  beforeEach(async () => {
    await createTestUser();

    token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can create new order as authenticated user", async () => {
    const cart = await request.get("/api/carts").set("Authorization", `Bearer ${token}`);
    const result = await request
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cart: { ...cart.body.data },
        customerDetails,
        shippingDetails,
        deliveryDetails,
      });

    expect(result.status).toBe(201);
    expect(result.body.data.username).toBe(username);
    expect(result.body.data.guestId).toBeNull();
    expect(result.body.data.status).toBe("uncomplete");
    expect(result.body.data.total).toBe(
      calculateTotalPrice([...cart.body.data.cartItems, { name: deliveryDetails.method, quantity: 1, product: { price: deliveryDetails.cost } }])
    );
    expect(result.body.data.subTotal).toBe(calculateTotalPrice(cart.body.data.cartItems));
  });

  it("should can create new order as guest user", async () => {
    const guestUser = await request.get("/api/users/guest");
    const cart = {
      cartItems: [{ productSlug: "pizza-1", quantity: 1 }],
      totalPrice: 10001,
    };
    const result = await request.post("/api/orders").query({ guest_uid: guestUser.body.data.guestUserId }).send({
      cart,
      customerDetails,
      shippingDetails,
      deliveryDetails,
    });

    expect(result.status).toBe(201);
    expect(result.body.data.username).toBeNull();
    expect(result.body.data.guestId).toBe(guestUser.body.data.guestUserId);
    expect(result.body.data.status).toBe("uncomplete");
    expect(result.body.data.total).toBe(cart.totalPrice + deliveryDetails.cost);
    expect(result.body.data.subTotal).toBe(cart.totalPrice);
  });

  it("should reject if token is invalid", async () => {
    const cart = await request.get("/api/carts").set("Authorization", `Bearer ${token}`);
    const result = await request
      .post("/api/orders")
      .set("Authorization", "invalid-token")
      .send({ cart: { ...cart.body.data }, customerDetails, shippingDetails, deliveryDetails });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if item is empty", async () => {
    await removeManyCartItems();

    const result = await request.post("/api/orders").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});

describe("POST /api/orders/checkout", function () {
  let token;

  beforeEach(async () => {
    await createTestUser();

    token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can checkout order as authenticated user", async () => {
    const cart = await request.get("/api/carts").set("Authorization", `Bearer ${token}`);
    const order = await request
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cart: { ...cart.body.data },
        customerDetails,
        shippingDetails,
        deliveryDetails,
      });

    const result = await request.post("/api/orders/checkout").query({ id: order.body.data.id }).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(validate(result.body.data)).toBe(true);
  });

  it("should can checkout order as guest user", async () => {
    const guestUser = await request.get("/api/users/guest");
    const cart = {
      cartItems: [{ productSlug: "pizza-1", quantity: 1 }],
      totalPrice: 10001,
    };
    const order = await request.post("/api/orders").query({ guest_uid: guestUser.body.data.guestUserId }).send({
      cart,
      customerDetails,
      shippingDetails,
      deliveryDetails,
    });

    const result = await request.post("/api/orders/checkout").query({ id: order.body.data.id, guest_uid: guestUser.body.data.guestUserId });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(validate(result.body.data)).toBe(true);
  });

  it("should reject if token is invalid", async () => {
    const cart = await request.get("/api/carts").set("Authorization", `Bearer ${token}`);
    const order = await request
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cart: { ...cart.body.data },
        customerDetails,
        shippingDetails,
        deliveryDetails,
      });
    const result = await request.post("/api/orders/checkout").query({ id: order.body.data.id }).set("Authorization", "invalid-token");

    expect(result.status).toBe(401);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should return old session if not expired", async () => {
    const cart = await request.get("/api/carts").set("Authorization", `Bearer ${token}`);
    const order = await request
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cart: { ...cart.body.data },
        customerDetails,
        shippingDetails,
        deliveryDetails,
      });
    const oldSession = await request.post("/api/orders/checkout").query({ id: order.body.data.id }).set("Authorization", `Bearer ${token}`);
    const result = await request.post("/api/orders/checkout").query({ id: order.body.data.id }).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(validate(result.body.data)).toBe(true);
    expect(result.body.data).toBe(oldSession.body.data);
  });
});

describe("GET /api/orders/:orderId", function () {
  let token;

  beforeEach(async () => {
    await createTestUser();

    token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get order as authenticated user", async () => {
    const cart = await request.get("/api/carts").set("Authorization", `Bearer ${token}`);
    const order = await request
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ cart: { ...cart.body.data }, customerDetails, shippingDetails, deliveryDetails });

    const result = await request.get(`/api/orders/${order.body.data.id}`).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(order.body.data.id);
    expect(result.body.data.items).toBeDefined();
    expect(result.body.data.username).toBe(order.body.data.username);
  });

  it("should can get order as guest user", async () => {
    const guestUser = await request.get("/api/users/guest");
    const cart = {
      cartItems: [{ productSlug: "pizza-1", quantity: 1 }],
      totalPrice: 10001,
    };
    const order = await request
      .post("/api/orders")
      .query({ guest_uid: guestUser.body.data.guestUserId })
      .send({ cart, customerDetails, shippingDetails, deliveryDetails });

    const result = await request.get(`/api/orders/${order.body.data.id}`).query({ guest_uid: guestUser.body.data.guestUserId });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(order.body.data.id);
    expect(result.body.data.items).toBeDefined();
    expect(result.body.data.guestId).toBe(order.body.data.guestId);
  });

  it("should reject if order id is invalid", async () => {
    await request.post("/api/orders").send({ cart: { cartItems: [{ productSlug: "pizza-1", quantity: 5 }] }, customerDetails, shippingDetails, deliveryDetails });
    const result = await request.get("/api/orders/f5e531e2-4fd6-4812-b839-be652fd18bd3").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});

describe("POST /api/orders/:orderId/cancel", function () {
  let token;

  beforeEach(async () => {
    await createTestUser();

    token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can cancel order as authenticated user", async () => {
    const cart = await request.get("/api/carts").set("Authorization", `Bearer ${token}`);
    const order = await request
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ cart: { ...cart.body.data }, customerDetails, shippingDetails, deliveryDetails });

    const result = await request.post(`/api/orders/${order.body.data.id}/cancel`).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(order.body.data.id);
    expect(result.body.data.status).toBe("canceled");
    expect(result.body.data.items).toBeDefined();
  });

  it("should can cancel order as guest user", async () => {
    const guestUser = await request.get("/api/users/guest");
    const cart = {
      cartItems: [{ productSlug: "pizza-1", quantity: 1 }],
      totalPrice: 10001,
    };
    const order = await request
      .post("/api/orders")
      .query({ guest_uid: guestUser.body.data.guestUserId })
      .send({ cart, customerDetails, shippingDetails, deliveryDetails });

    const result = await request.post(`/api/orders/${order.body.data.id}/cancel`).query({ guest_uid: guestUser.body.data.guestUserId });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(order.body.data.id);
    expect(result.body.data.status).toBe("canceled");
    expect(result.body.data.items).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const cart = await request.get("/api/carts").set("Authorization", `Bearer ${token}`);
    const order = await request
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ cart: { ...cart.body.data }, customerDetails, shippingDetails, deliveryDetails });

    const result = await request.post(`/api/orders/${order.body.data.id}/cancel`).set("Authorization", invalidToken);

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
    await request.put("/api/carts/items").set("Authorization", `Bearer ${authUser.body.data.token}`).send({ productSlug: product.body.data.slug, quantity: 5 });
    const cart = await request.get("/api/carts").set("Authorization", `Bearer ${token}`);

    const order = await request
      .post("/api/orders")
      .set("Authorization", `Bearer ${authUser.body.data.token}`)
      .send({ cart: { ...cart.body.data }, customerDetails, shippingDetails, deliveryDetails });
    const result = await request.post(`/api/orders/${order.body.data.id}/cancel`).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if cancel other guest user order", async () => {
    const guestUser = await request.get("/api/users/guest");
    const cart = {
      cartItems: [{ productSlug: "pizza-1", quantity: 1 }],
      totalPrice: 10001,
    };
    const order = await request
      .post("/api/orders")
      .query({ guest_uid: guestUser.body.data.guestUserId })
      .send({ cart, customerDetails, shippingDetails, deliveryDetails });
    const otherGuestUser = await request.get("/api/users/guest");

    const result = await request.post(`/api/orders/${order.body.data.id}/cancel`).query({ guest_uid: otherGuestUser.body.data.guestUserId });

    expect(result.status).toBe(404);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });
});
