import bcrypt from "bcrypt";
import { name, password, phonenumberForm, username, createTestUser, removeTestUser, token, getTestUser, invalidToken } from "./test-util.js";
import { request } from "./setup.js";
import { validate } from "uuid";

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register new user", async () => {
    const result = await request.post("/api/users").send({ username, name, password, phonenumberForm });

    expect(result.status).toBe(201);
    expect(result.body.data.username).toBe(username);
    expect(result.body.data.profile.name).toBe(name);
    expect(result.body.data.phonenumber).toBe(phonenumberForm.number);
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.cart).toBeDefined();
  });

  it("should reject if username already registered", async () => {
    let result = await request.post("/api/users").send({ username, name, password, phonenumberForm });

    expect(result.status).toBe(201);
    expect(result.body.data.username).toBe(username);
    expect(result.body.data.profile.name).toBe(name);
    expect(result.body.data.phonenumber).toBe(phonenumberForm.number);
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.cart).toBeDefined();

    result = await request.post("/api/users").send({ username, name, password, phonenumberForm });

    expect(result.status).toBe(409);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await request.post("/api/users").send({ username: "", name: "", password: "", phonenumberForm: { number: "", countryId: "" } });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should success login with valid account", async () => {
    const result = await request.post("/api/users/login").send({ username, password });

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe(token);
  });

  it("should reject if account is invalid", async () => {
    const result = await request.post("/api/users/login").send({ username: "", password: "" });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if username is invalid", async () => {
    const result = await request.post("/api/users/login").send({ username: "asal", password });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });

  it("should reject if password is invalid", async () => {
    const result = await request.post("/api/users/login").send({ username, password: "asal" });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});

describe("GET /api/users/current", function () {
  let token;

  beforeEach(async () => {
    await createTestUser();

    token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get current authenticated user", async () => {
    const result = await request.get("/api/users/current").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe(username);
    expect(result.body.data.profile.name).toBe(name);
    expect(result.body.data.cart).toBeDefined();
    expect(result.body.data.cart.cartItems.length).toBeGreaterThan(0);
  });

  it("should reject if token is invalid", async () => {
    const result = await request.get("/api/users/current").set("Authorization", `Bearer ${invalidToken}`);

    expect(result.status).toBe(422);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/guest", function () {
  it("should return guest user id if token not provided", async () => {
    const result = await request.get("/api/users/guest");

    expect(result.status).toBe(201);
    expect(validate(result.body.data.guestUserId)).toBe(true);
  });
});

describe("PATCH /api/users/current", function () {
  const newName = "New Test User Name";
  let token;

  beforeEach(async () => {
    await createTestUser();

    token = (await request.post("/api/users/login").send({ username, password })).body.data.token;
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can update current user", async () => {
    const result = await request.patch("/api/users/current").set("Authorization", `Bearer ${token}`).send({ name: newName });
    const testUser = await getTestUser();
    const isValidPassword = await bcrypt.compare(password, testUser.password);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe(username);
    expect(result.body.data.profile.name).toBe(newName);
    expect(isValidPassword).toBe(true);
  });

  it("should can update name current user", async () => {
    const result = await request.patch("/api/users/current").set("Authorization", `Bearer ${token}`).send({ name: newName });
    const testUser = await getTestUser();
    const isValidPassword = await bcrypt.compare(password, testUser.password);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe(username);
    expect(result.body.data.profile.name).toBe(newName);
    expect(isValidPassword).toBe(true);
  });

  it("should reject if token is invalid", async () => {
    const result = await request.patch("/api/users/current").set("Authorization", `Bearer ${invalidToken}`).send({ name: newName });

    expect(result.status).toBe(422);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await request.patch("/api/users/current").set("Authorization", `Bearer ${token}`).send({ name: "", password: "" });

    expect(result.status).toBe(400);
    expect(result.body.data).toBeUndefined();
    expect(result.body.errors).toBeDefined();
  });
});

// describe("DELETE /api/users/logout", function () {
//   beforeEach(async () => {
//     await createTestUser();
//   });

//   afterEach(async () => {
//     await removeTestUser();
//   });

//   it("should can logout", async () => {
//     const result = await request.delete("/api/users/logout").set("Authorization", `Bearer ${token}`);
//     const user = await getTestUser();

//     expect(result.status).toBe(200);
//     expect(result.body.data).toBe("Logged out!");
//     expect(user.token).toBeNull();
//   });

//   it("should reject if token is invalid", async () => {
//     const result = await request.delete("/api/users/logout").set("Authorization", invalidToken);
//     const user = await getTestUser();

//     expect(result.status).toBe(422);
//     expect(result.body.data).toBeUndefined();
//     expect(result.body.errors).toBeDefined();
//     expect(user.token).toBe(token);
//   });
// });
