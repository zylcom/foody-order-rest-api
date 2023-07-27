import supertest from "supertest";
import { web } from "../src/app/web";

describe("POST /api/webhook", function () {
  it("should reject if stripe signature not provided", async () => {
    const result = await supertest(web).post("/api/webhook").send({});

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
