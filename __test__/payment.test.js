import { request } from "./setup";
import { createPaymentTest, createTestUser, password, removePaymentTest, removeTestUser, username } from "./test-util";

describe("GET /api/payment/:transactionId", function () {
  let token;

  beforeEach(async () => {
    await createTestUser();
    await createPaymentTest();

    token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
  });

  afterEach(async () => {
    await removePaymentTest();
    await removeTestUser();
  });

  it("should can get payment data", async () => {
    /**
     * Midtrans error
     * data: {
     *   status_code: '500',
     *   status_message: 'Sorry. Our system is recovering from unexpected issues. Please retry.',
     *   id: 'a7e65186-ad58-4621-9f4b-4b9af41b87cb'
     * }
     */
    // const order = await request.get("/api/orders/76a1b635-5964-462d-a224-3a42008d9abb").set("Authorization", `Bearer ${token}`);
    // const notificationJson = {
    //   transaction_time: "2023-12-23 16:42:13",
    //   transaction_status: "settlement",
    //   transaction_id: "d33d1747-f265-4a64-89b8-f02982e73032",
    //   store: "alfamart",
    //   status_message: "midtrans payment notification",
    //   status_code: "201",
    //   signature_key: "1753c8db0376d14e8d92ab14cc8a0b781f935e92e7ba848388e63c276403bb749a0bad9d34e61b3bfbeacb481658ce5e8edb1a98d642d540c5091fe961da9d54",
    //   payment_type: "cstore",
    //   payment_code: "3101101715649288",
    //   order_id: order.body.data.id,
    //   merchant_id: "G310191577",
    //   gross_amount: order.body.data.total,
    //   fraud_status: "accept",
    //   expiry_time: "2023-12-24 16:42:13",
    //   currency: "IDR",
    // };
    // await request.post("/api/webhook").send(notificationJson);
    // const result = await request.get(`/api/payment/${notificationJson.transaction_id}`).set("Authorization", `Bearer ${token}`);
    // expect(result.status).toBe(200);
    // expect(result.body.data.order.id).toBe(order.body.data.id);
    // expect(result.body.data.signatureKey).toBe(notificationJson.signature_key);
    // expect(result.body.data.transactionId).toBe(notificationJson.transaction_id);
  });
});
