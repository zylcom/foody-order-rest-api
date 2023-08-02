import supertest from "supertest";
import { web } from "../src/app/web";
import { createTestUser, removeTestUser, token } from "./test-util";

beforeAll(async () => {
  await createTestUser();
});

afterAll(async () => {
  await removeTestUser();
});

describe("POST /api/products/:productSlug/like", function () {
  it("should can like product", async () => {
    const user = await supertest(web).get("/api/users/current").set("Authorization", token);
    const result = await supertest(web).post("/api/products/pizza-1/like").set("Authorization", token);
    const product = await supertest(web).get("/api/products/pizza-1");

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe(user.body.data.username);
    expect(result.body.data.productSlug).toBe("pizza-1");
    expect(product.body.data.likes.length).toBe(2);
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web).post("/api/products/pizza-1/like").set("Authorization", "invalid-token");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if product slug is invalid", async () => {
    const result = await supertest(web).post("/api/products/pizza-404/like").set("Authorization", token);

    expect(result.status).toBe(404);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });
});
