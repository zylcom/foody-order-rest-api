import supertest from "supertest";
import { web } from "../src/app/web";
import { createTestCategory, removeTestCategory } from "./test-util";

describe("GET /api/categories", function () {
  beforeEach(async () => {
    await createTestCategory();
  });

  afterEach(async () => {
    await removeTestCategory();
  });

  it("should can get categories", async () => {
    const result = await supertest(web).get("/api/categories");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(2);
    expect(result.body.data[0].name).toBe("Food");
  });
});
