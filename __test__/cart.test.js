import supertest from "supertest";
import { web } from "../src/app/web";
import { createTestUser, removeTestUser, token } from "./test-util";
import { logger } from "../src/app/logging";
import { calculateTotalPrice } from "../src/utils";

jest.setTimeout(60000);

beforeAll(() => {
  logger.silent = true;
});

afterAll(() => {
  logger.silent = false;
});

describe("GET /api/users/current/carts", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get the cart current user", async () => {
    const result = await supertest(web).get("/api/users/current/carts").set("Authorization", token);

    expect(result.body.data.cartItems).toBeDefined();
    expect(result.body.data.cartItems.length).toBeGreaterThan(0);
    expect(result.body.data.totalPrice).toBe(calculateTotalPrice(result.body.data.cartItems));
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web).get("/api/users/current/carts").set("Authorization", "invalid-token");

    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});
