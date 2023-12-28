import { request } from "./setup";
import { createPaymentTest, createTestUser, name, removeTestUser } from "./test-util";

describe("GET /api/payment/:sessionId", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get payment data", async () => {
    const guestUser = await request.get("/api/users/guest");

    // await createPaymentTest(guestUser.body.data.guestUserId);
    // const result = await request.get(`/api/payment/${sessionId}`).query({ guest_uid: guestUser.body.data.guestUserId });

    // expect(result.status).toBe(200);
    // expect(result.body.data.guestId).toBe(guestUser.body.data.guestUserId);
    // expect(result.body.data.checkoutSessionId).toBe(sessionId);
    // expect(result.body.data.payment.name).toBe(name);
  });
});
