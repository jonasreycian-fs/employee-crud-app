// Address class with attributes
// street, city, state, zip, country
class Address {
  constructor(landmark, street, city, zip, country) {
    this.landmark = landmark;
    this.street = street;
    this.city = city;
    this.country = country;
  }
}

// User class with attributes
// first_name, last_name, email, physical_address, billing_address
class User {
  constructor(
    id,
    first_name,
    last_name,
    email,
    physical_address,
    billing_address
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.physical_address = physical_address;
    this.billing_address = billing_address;
    this.updated_at = +new Date();
    this.created_at = +new Date();
  }
}

// Export the classes
module.exports = {
  Address: Address,
  User: User,
};
