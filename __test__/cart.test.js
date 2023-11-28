import { createTestUser, invalidToken, password, removeTestUser, username } from "./test-util";
import { calculateTotalPrice } from "../src/utils";
import { request } from "./setup";

describe("GET /api/carts", function () {
  let token;

  beforeEach(async () => {
    await createTestUser();

    token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get the cart current user", async () => {
    const result = await request.get("/api/carts").set("Authorization", `Bearer ${token}`);

    expect(result.body.data.cartItems).toBeDefined();
    expect(result.body.data.cartItems.length).toBeGreaterThan(0);
    expect(result.body.data.totalPrice).toBe(calculateTotalPrice(result.body.data.cartItems));
  });

  it("should reject if token is invalid", async () => {
    const result = await request.get("/api/carts").set("Authorization", `Bearer ${invalidToken}`);

    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});

describe("POST /api/carts/validate", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can validate cart", async () => {
    const result = await request.post("/api/carts/validate").send({
      cartItems: [
        { productSlug: "pizza-1", quantity: 5 },
        { productSlug: "pizza-2", quantity: 10 },
        { productSlug: "pizza-2", quantity: -100 },
        { productSlug: "pizza-3" },
        { productSlug: "pizzadasdasd", quantity: 5 },
        { productSlug: 123, quantity: 5 },
        { quantity: 5 },
      ],
      totalPrice: 0,
    });

    expect(result.status).toBe(200);
    expect(result.body.data).toHaveProperty("cartItems");
    expect(result.body.data).toHaveProperty("totalPrice");
    expect(result.body.data.totalPrice).toBe(5 * 10001 + 10 * 10002);
    expect(result.body.data.cartItems).toHaveLength(2);
    expect(result.body.data.cartItems[0]).toHaveProperty("product");
    expect(result.body.data.cartItems[1]).toHaveProperty("product");
  });
});
