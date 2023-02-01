// Address class with attributes
// street, city, state, zip, country
class Address {
  constructor(landmark, street, city, zip, country) {
    this.landmark = landmark;
    this.street = street;
    this.city = city;
    this.zip = zip;
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
    this.updated_at = Date.now();
    this.created_at = Date.now();
  }
}

// Export the classes
module.exports = {
  Address: Address,
  User: User,
};
