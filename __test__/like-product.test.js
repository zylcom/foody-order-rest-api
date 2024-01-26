import { createTestUser, invalidToken, password, removeTestUser, username } from "./test-util";
import { request } from "./setup";

let token;

beforeAll(async () => {
  await createTestUser();

  token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
});

afterAll(async () => {
  await removeTestUser();
});

describe("POST /api/products/:productSlug/like", function () {
  it("should can like product", async () => {
    const user = await request.get("/api/users/current").set("Authorization", `Bearer ${token}`);
    const result = await request.post("/api/products/pizza-1/like").set("Authorization", `Bearer ${token}`);
    const product = await request.get("/api/products/pizza-1");

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe(user.body.data.username);
    expect(result.body.data.productSlug).toBe("pizza-1");
    expect(product.body.data.likes.length).toBe(2);
  });

  it("should reject if token is invalid", async () => {
    const result = await request.post("/api/products/pizza-1/like").set("Authorization", `Bearer ${invalidToken}`);

    expect(result.status).toBe(422);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if product slug is invalid", async () => {
    const result = await request.post("/api/products/pizza-404/like").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });
});
