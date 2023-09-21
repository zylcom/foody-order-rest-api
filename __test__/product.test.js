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
  token,
} from "./test-util";
import { request } from "./setup";

describe("GET /api/products/:slug", function () {
  beforeEach(async () => {
    await createTestProduct();
  });

  afterEach(async () => {
    await removeTestProduct();
  });

  it("should can get product", async () => {
    const result = await request.get(`/api/products/${productSlug}`);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe(productName);
    expect(result.body.data.slug).toBe(productSlug);
    expect(result.body.data.description).toBe(productDescription);
    expect(result.body.data.ingredients).toBe(productIngredients);
    expect(result.body.data.price).toBe(productPrice);
    expect(result.body.data.reviews).toBeDefined();
  });

  it("should reject if slug is invalid", async () => {
    const result = await request.get("/api/products/invalid-slug");

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
    const result = await request.get("/api/products/search");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
  });

  it("should can search to page 2", async () => {
    const result = await request.get("/api/products/search").query({ page: 2 });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(false);
  });

  it("should can get all products", async () => {
    const result = await request.get("/api/products/search").query({ getAll: true });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(20);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(1);
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(false);
  });

  it("should can get all products even with size query", async () => {
    const result = await request.get("/api/products/search").query({ getAll: true });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(20);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(1);
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(false);
  });

  it("should can search with size 15", async () => {
    const result = await request.get("/api/products/search").query({ size: 15 });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(15);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
  });

  it("should can search using name", async () => {
    const result = await request.get("/api/products/search").query({ name: "1" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalProducts).toBe(11);
    expect(result.body.paging.hasNextPage).toBe(true);
  });

  it("should can search using category", async () => {
    const result = await request.get("/api/products/search").query({ category: "food" });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBeDefined();
    expect(result.body.paging.totalProducts).toBeDefined();
    expect(result.body.paging.hasNextPage).toBeDefined();
  });

  it("should can search using tag", async () => {
    const result = await request.get("/api/products/search").query({ tag: "tag" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
  });

  it("should can search using tag, name, category, size, page", async () => {
    const result = await request.get("/api/products/search").query({
      category: "food",
      name: "pizza",
      page: 2,
      size: 15,
      tag: "tag",
    });

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
    const result = await request.get("/api/products").query();

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });

  it("should can get products using name", async () => {
    const result = await request.get("/api/products").query({ name: "5" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(2);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBe(2);
    expect(result.body.paging.hasNextPage).toBe(false);
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });

  it("should can get products using tag", async () => {
    const result = await request.get("/api/products").query({ tag: "tag" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });

  it("should can get products using category", async () => {
    const result = await request.get("/api/products").query({ category: "foo" });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBeDefined();
    expect(result.body.paging.hasNextPage).toBeDefined();
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });

  it("should can get products using cursor", async () => {
    const product = await request.get("/api/products/pizza-5");
    const result = await request.get("/api/products").query({ cursor: product.body.data.id });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.totalProducts).toBe(20);
    expect(result.body.paging.hasNextPage).toBe(true);
    expect(result.body.paging.nextCursor).toBe(result.body.data.at(-1).id);
  });

  it("should can get products using cursor, name, category and tag", async () => {
    const product = await request.get("/api/products/pizza-1");
    const result = await request.get("/api/products").query({
      name: "1",
      category: "foo",
      tag: "tag",
      cursor: product.body.data.id,
    });

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
    const result = await request.get("/api/products/best-rated");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBeLessThan(6);
  });

  it("should can get best rated products with category drink", async () => {
    const result = await request.get("/api/products/best-rated").query({ category: "drink" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBeLessThan(6);
  });
});

describe("PUT /api/products", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can update product", async () => {
    const product = await request.get("/api/products/pizza-1");
    const tags = [1, 2, 3].filter((id) => id !== product.body.data.tags[0].tagId);
    const categorySlug = product.body.data.categorySlug === "food" ? "drink" : "food";
    const result = await request
      .put("/api/products")
      .send({
        id: product.body.data.id,
        name: "Updated Product",
        description: "Updated",
        slug: product.body.data.slug,
        ingredients: "Updated",
        categorySlug,
        price: 1,
        tags,
      })
      .set("Authorization", token);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("Updated Product");
    expect(result.body.data.categorySlug).toBe(categorySlug);
    expect(result.body.data.description).toBe("Updated");
    expect(result.body.data.ingredients).toBe("Updated");
    expect(result.body.data.price).toBe(1);
    expect(result.body.data.tags.length).toBe(tags.length);
  });

  it("should reject if token is invalid", async () => {
    const product = await request.get("/api/products/pizza-1");
    const result = await request.put("/api/products").send({
      name: "Updated Product",
      description: "Updated",
      slug: product.body.data.slug,
      ingredients: "Updated",
      categorySlug: product.body.data.categorySlug,
      price: 1,
      tags: [1, 2, 3],
    });

    expect(result.status).toBe(401);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should can update product name", async () => {
    const product = await request.get("/api/products/pizza-1");
    const result = await request
      .put("/api/products")
      .send({
        id: product.body.data.id,
        name: "Updated Product",
        slug: product.body.data.slug,
        categorySlug: product.body.data.categorySlug,
        tags: product.body.data.tags.map((tag) => tag.id),
      })
      .set("Authorization", token);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("Updated Product");
    expect(result.body.data.categorySlug).toBe(product.body.data.categorySlug);
    expect(result.body.data.description).toBe(product.body.data.description);
    expect(result.body.data.ingredients).toBe(product.body.data.ingredients);
    expect(result.body.data.price).toBe(product.body.data.price);
    expect(result.body.data.tags.length).toBe(product.body.data.tags.length);
  });
});

describe("DELETE /api/products/:productSlug", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can delete product", async () => {
    const result = await request.delete("/api/products/pizza-1").set("Authorization", token);
    const product = await request.get("/api/products/pizza-1");

    expect(result.status).toBe(200);
    expect(product.body.errors).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const result = await request.delete("/api/products/pizza-1").set("Authorization", "invalid-token");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if product not found", async () => {
    const result = await request.delete("/api/products/pizza-404").set("Authorization", token);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/products/create", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can create product", async () => {
    const result = await request
      .post("/api/products/create")
      .set("Authorization", token)
      .send({
        name: "New Product",
        slug: "new-product",
        categorySlug: "food",
        price: 1000,
        tags: [1],
      });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("New Product");
    expect(result.body.data.slug).toBe("new-product");
    expect(result.body.data.categorySlug).toBe("food");
    expect(result.body.data.price).toBe(1000);
    expect(result.body.data.tags[0].id).toBe(1);
  });

  it("should reject if token is invalid", async () => {
    const result = await request
      .post("/api/products/create")
      .set("Authorization", "invalid-token")
      .send({
        name: "New Product",
        slug: "new-product",
        categorySlug: "food",
        price: 1000,
        tags: [1],
      });

    expect(result.status).toBe(401);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if product name is undefined", async () => {
    const result = await request
      .post("/api/products/create")
      .set("Authorization", token)
      .send({
        slug: "new-product",
        categorySlug: "food",
        price: 1000,
        tags: [1],
      });

    expect(result.status).toBe(400);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if slug is invalid", async () => {
    const result = await request
      .post("/api/products/create")
      .set("Authorization", token)
      .send({
        name: "New Product",
        slug: "iN-Valid--slug-",
        categorySlug: "food",
        price: 1000,
        tags: [1],
      });

    expect(result.status).toBe(400);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if slug is undefined", async () => {
    const result = await request
      .post("/api/products/create")
      .set("Authorization", token)
      .send({
        name: "New Product",
        categorySlug: "food",
        price: 1000,
        tags: [1],
      });

    expect(result.status).toBe(400);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if price is less than 1", async () => {
    const result = await request
      .post("/api/products/create")
      .set("Authorization", token)
      .send({
        name: "New Product",
        slug: "new-product",
        categorySlug: "food",
        price: 0,
        tags: [1],
      });

    expect(result.status).toBe(400);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if category slug is invalid", async () => {
    const result = await request
      .post("/api/products/create")
      .set("Authorization", token)
      .send({
        name: "New Product",
        slug: "new-product",
        categorySlug: "invalid-category-slug",
        price: 1000,
        tags: [1],
      });

    expect(result.status).toBe(400);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if tags is undefined", async () => {
    const result = await request.post("/api/products/create").set("Authorization", token).send({
      name: "New Product",
      slug: "new-product",
      categorySlug: "food",
      price: 1000,
    });

    expect(result.status).toBe(400);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });
});
