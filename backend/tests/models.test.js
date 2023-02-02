// Write a testcase for the models.js file

const { Address, User } = require("../models/models");

describe("Address", () => {
  it("should create a new address", () => {
    const address = new Address("Landmark", "Street", "City", "Country");
    expect(address).toBeInstanceOf(Address);
    expect(address.landmark).toEqual("Landmark");
    expect(address.street).toEqual("Street");
    expect(address.city).toEqual("City");
  });

  it("should create a new address with default values", () => {
    const address = new Address();
    expect(address).toEqual({
      landmark: undefined,
      street: undefined,
      city: undefined,
      country: undefined,
    });
  });
});

describe("User", () => {
  it("should create a new user", () => {
    const address = new Address("Landmark", "Street", "City", "Country");
    const user = new User(
      "ID",
      "First Name",
      "Last Name",
      "Email",
      address,
      address
    );

    expect(user).toEqual({
      id: "ID",
      first_name: "First Name",
      last_name: "Last Name",
      email: "Email",
      physical_address: address,
      billing_address: address,
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });
  });

  it("should create a new user with default values", () => {
    const address = new Address();
    const user = new User();
    expect(user).toEqual({
      id: undefined,
      first_name: undefined,
      last_name: undefined,
      email: undefined,
      physical_address: undefined,
      billing_address: undefined,
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });
  });
});
