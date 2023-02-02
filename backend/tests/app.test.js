// Creates a test for the api endpoint that adds a new user to data.json

const request = require("supertest");
const { app } = require("../app");
const { faker } = require("@faker-js/faker");

describe("GET /", () => {
  it("should get default message", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("id");
  });
});

describe("GET /api/users?name=", () => {
  it("should get all users", async () => {
    const res = await request(app).get("/api/users?name=");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});

describe("POST /api/users", () => {
  it("should add a new user then delete it", async () => {
    let res = await request(app).post("/api/users").send({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      physical_address: {},
      billing_address: {},
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
  });
});

describe("DELETE /api/users/:id", () => {
  it("should delete a user", async () => {
    let response = await request(app).get("/api/users?name=");

    const users = response.body;
    const user = users.pop();

    response = await request(app).delete(`/api/users/${user.id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("User deleted successfully");
  });
});

describe("GET /api/users/:id", () => {
  it("should get a user", async () => {
    let response = await request(app).get("/api/users?name=");

    const users = response.body;
    const user = users.pop();

    response = await request(app).get(`/api/users/${user.id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("billing_address");
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("first_name");
    expect(response.body).toHaveProperty("last_name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("physical_address");
    expect(response.body).toHaveProperty("billing_address");
  });

  it("should return 404 if user not found", async () => {
    const response = await request(app).get("/api/users/123456");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("User not found");
  });
});

// Update a user
describe("PUT /api/users/:id", () => {
  it("should update a user", async () => {
    let response = await request(app).get("/api/users?name=");

    const users = response.body;
    const user = users[0];

    const physicalAddress = {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      landmark: faker.address.street(),
      country: faker.address.country(),
    };

    const billingAddress = {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      landmark: faker.address.street(),
      country: faker.address.country(),
    };

    response = await request(app)
      .put(`/api/users/${user.id}`)
      .send({
        ...user,
        physical_address: { ...physicalAddress },
        billing_address: { ...billingAddress },
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("User updated successfully");

    expect(response.body).toHaveProperty("data");
    expect(response.body.data.physical_address).toEqual(physicalAddress);
    expect(response.body.data.billing_address).toEqual(billingAddress);
  });

  it("should return 404 if user not found", async () => {
    const response = await request(app).put("/api/users/QQQQQQQQ");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("User not found");
  });
});
