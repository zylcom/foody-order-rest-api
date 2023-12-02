import { createTestUser, name, password, phonenumberForm, removeTestReview, removeTestUser, username } from "./test-util";
import { request } from "./setup";

let token;

beforeAll(async () => {
  await createTestUser();

  token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
});

afterAll(async () => {
  await removeTestUser();
});

describe("POST /api/products/reviews", function () {
  afterEach(async () => {
    await removeTestReview();
  });

  it("should can create new review", async () => {
    const result = await request
      .post("/api/products/reviews")
      .send({ description: "Wailah enak", rating: 5, productSlug: "pizza-1" })
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);

    const product = await request.get(`/api/products/${result.body.data.productSlug}`);

    expect(result.body.data.productSlug).toBe(product.body.data.slug);
    expect(result.body.data.rating).toBe(5);
    expect(result.body.data.description).toBe("Wailah enak");
    expect(result.body.data.username).toBe(username);
  });

  it("should can create new review without description", async () => {
    const result = await request.post("/api/products/reviews").send({ rating: 5, productSlug: "pizza-1" }).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);

    const product = await request.get(`/api/products/${result.body.data.productSlug}`);

    expect(result.body.data.productSlug).toBe(product.body.data.slug);
    expect(result.body.data.rating).toBe(5);
    expect(result.body.data.description).toBeNull();
  });

  it("should reject if review already exist", async () => {
    await request.post("/api/products/reviews").send({ description: "Wailah enak", rating: 5, productSlug: "pizza-1" }).set("Authorization", `Bearer ${token}`);

    const result = await request
      .post("/api/products/reviews")
      .send({ description: "Wailah enak", rating: 5, productSlug: "pizza-1" })
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(409);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if token is invalid", async () => {
    const result = await request
      .post("/api/products/reviews")
      .send({ description: "Wailah enak", rating: 5, productSlug: "pizza-1" })
      .set("Authorization", "invalid-token");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await request.post("/api/products/reviews").send({}).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if product slug is invalid", async () => {
    const result = await request
      .post("/api/products/reviews")
      .send({ description: "Wailah enak", rating: 5, productSlug: "pizza-404" })
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});

describe("PUT /api/products/reviews", function () {
  afterEach(async () => {
    await removeTestReview();
  });

  it("should can update review", async () => {
    await request.post("/api/products/reviews").send({ description: "Wailah enak", rating: 5, productSlug: "pizza-1" }).set("Authorization", `Bearer ${token}`);

    const result = await request
      .put("/api/products/reviews")
      .send({ rating: 2, description: "Huueeek", productSlug: "pizza-1" })
      .set("Authorization", `Bearer ${token}`);
    const product = await request.get("/api/products/pizza-1");

    expect(result.status).toBe(200);
    expect(result.body.data.description).toBe("Huueeek");
    expect(result.body.data.rating).toBe(2);
    expect(result.body.data.username).toBe(username);
    expect(product.body.data.averageRating).toBe(2);
  });

  it("should can update review with empty string description", async () => {
    await request.post("/api/products/reviews").send({ description: "Wailah enak", rating: 5, productSlug: "pizza-1" }).set("Authorization", `Bearer ${token}`);

    const result = await request.put("/api/products/reviews").send({ rating: 2, description: "", productSlug: "pizza-1" }).set("Authorization", `Bearer ${token}`);
    const product = await request.get("/api/products/pizza-1");

    expect(result.status).toBe(200);
    expect(result.body.data.description).toBe("");
    expect(result.body.data.rating).toBe(2);
    expect(result.body.data.username).toBe(username);
    expect(product.body.data.averageRating).toBe(2);
  });

  it("should can update review without description", async () => {
    await request.post("/api/products/reviews").send({ description: "Wailah enak", rating: 5, productSlug: "pizza-1" }).set("Authorization", `Bearer ${token}`);

    const result = await request.put("/api/products/reviews").send({ rating: 2, productSlug: "pizza-1" }).set("Authorization", `Bearer ${token}`);
    const product = await request.get("/api/products/pizza-1");

    expect(result.status).toBe(200);
    expect(result.body.data.description).toBe("Wailah enak");
    expect(result.body.data.rating).toBe(2);
    expect(result.body.data.username).toBe(username);
    expect(product.body.data.averageRating).toBe(2);
  });

  it("should reject update if request is invalid", async () => {
    await request.post("/api/products/reviews").send({ description: "Wailah enak", rating: 5, productSlug: "pizza-1" }).set("Authorization", `Bearer ${token}`);

    const result = await request.put("/api/products/reviews").send({}).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject update if product slug is invalid", async () => {
    await request.post("/api/products/reviews").send({ description: "Wailah enak", rating: 5, productSlug: "pizza-1" }).set("Authorization", `Bearer ${token}`);

    const result = await request.put("/api/products/reviews").send({ rating: 5, productSlug: "pizza-404" }).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});
