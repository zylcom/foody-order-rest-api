import supertest from "supertest";
import { web } from "../src/app/web";
import { createTestUser, removeTestUser } from "./test-util";

beforeAll(async () => {
  await createTestUser();
});

afterAll(async () => {
  await removeTestUser();
});

describe("/api/tags", function () {
  it("should can get tag", async () => {
    const result = await supertest(web).get("/api/tags");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(3);
  });
});

describe("/api/tags/:productCategory", function () {
  it("should can get tag", async () => {
    const result = await supertest(web).get("/api/tags/food");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("should return empty array if category is invalid", async () => {
    const result = await supertest(web).get("/api/tags/invalid");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(0);
  });
});
