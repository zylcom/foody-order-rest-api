import { request } from "./setup";
import { createTestUser, invalidToken, password, removeTestUser, username } from "./test-util";

describe("POST /api/feedback", function () {
  let token;

  beforeEach(async () => {
    await createTestUser();

    token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can create feedback as guest user", async () => {
    const guestUser = await request.get("/api/users/guest");
    const result = await request.post("/api/feedback").query({ guest_uid: guestUser.body.data.guestUserId }).send({ description: "This is feedback description" });

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Feedback sent");
  });

  it("should can create feedback as authenticated user", async () => {
    const result = await request.post("/api/feedback").set("Authorization", `Bearer ${token}`).send({ description: "This is feedback description" });

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Feedback sent");
  });

  it("shoul reject if feedback description is empty", async () => {
    const guestUser = await request.get("/api/users/guest");
    const result_1 = await request.post("/api/feedback").query({ guest_uid: guestUser.body.data.guestUserId }).send({ description: "" });
    const result_2 = await request.post("/api/feedback").set("Authorization", `Bearer ${token}`).send({ description: "" });

    expect(result_1.status).toBe(400);
    expect(result_1.body.errors).toBeDefined();
    expect(result_2.status).toBe(400);
    expect(result_2.body.errors).toBeDefined();
  });

  it("shoul reject if feedback description is just white space", async () => {
    const guestUser = await request.get("/api/users/guest");
    const result_1 = await request.post("/api/feedback").query({ guest_uid: guestUser.body.data.guestUserId }).send({ description: "                " });
    const result_2 = await request.post("/api/feedback").set("Authorization", `Bearer ${token}`).send({ description: "                " });

    expect(result_1.status).toBe(400);
    expect(result_1.body.errors).toBeDefined();
    expect(result_2.status).toBe(400);
    expect(result_2.body.errors).toBeDefined();
  });

  it("shoul reject if unauthorized", async () => {
    const result_1 = await request.post("/api/feedback").query({ guest_uid: "" }).send({ description: "This is feedback description" });
    const result_2 = await request.post("/api/feedback").set("Authorization", invalidToken).send({ description: "This is feedback description" });

    expect(result_1.status).toBe(401);
    expect(result_1.body.errors).toBeDefined();
    expect(result_2.status).toBe(401);
    expect(result_2.body.errors).toBeDefined();
  });
});
