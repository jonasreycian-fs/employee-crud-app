// Staring point of the application with express server and cors, database using JSON file

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const { Address, User } = require("./models/models");

const app = express();
const port = 3000;
const filePath = "./data.json";

app.use(cors());
app.use(express.json());

// Get all users from data.json
app.get("/api/users", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(500).send({ message: err.message });
    res.send(JSON.parse(data));
  });
});

// Adding a new user to data.json
app.post("/api/users", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(500).send({ message: err.message });

    const users = JSON.parse(data);

    try {
      const physicalAddress = new Address(
        req.body.physical_address.landmark,
        req.body.physical_address.street,
        req.body.physical_address.city,
        req.body.physical_address.zip,
        req.body.physical_address.country
      );

      const billingAddress = new Address(
        req.body.billing_address.landmark,
        req.body.billing_address.street,
        req.body.billing_address.city,
        req.body.billing_address.zip,
        req.body.billing_address.country
      );

      const user = new User(
        faker.random.alphaNumeric(6).toUpperCase(),
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        physicalAddress,
        billingAddress
      );

      users.push(user);

      // Write users to data.json
      fs.writeFile(filePath, JSON.stringify(users), (err) => {
        if (err) return res.status(500).send({ message: err.message });
        res
          .status(201)
          .send({ message: "User added successfully", data: user });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  });
});

// Delete a user from data.json
app.delete("/api/users/:id", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(500).send({ message: err.message });

    const users = JSON.parse(data);
    const user = users.find((user) => user.id === req.params.id);

    if (!user) return res.status(404).send({ message: "User not found" });

    const index = users.indexOf(user);
    users.splice(index, 1);

    // Write users to data.json
    fs.writeFile(filePath, JSON.stringify(users), (err) => {
      if (err) return res.status(500).send({ message: err.message });
      res.status(200).send({ message: "User deleted successfully" });
    });
  });
});

// Gets a single user from data.json
app.get("/api/users/:id", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(500).send({ message: err.message });

    const users = JSON.parse(data);
    const user = users.find((user) => user.id === req.params.id);

    if (!user) return res.status(404).send({ message: "User not found" });

    res.send(user);
  });
});

// Update a user from data.json
app.put("/api/users/:id", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(500).send({ message: err.message });

    const users = JSON.parse(data);
    const user = users.find((user) => user.id === req.params.id);

    if (!user) return res.status(404).send({ message: "User not found" });

    try {
      const physicalAddress = new Address(
        req.body.physical_address.landmark,
        req.body.physical_address.street,
        req.body.physical_address.city,
        req.body.physical_address.zip,
        req.body.physical_address.country
      );

      const billingAddress = new Address(
        req.body.billing_address.landmark,
        req.body.billing_address.street,
        req.body.billing_address.city,
        req.body.billing_address.zip,

        req.body.billing_address.country
      );

      const updatedUser = new User(
        user.id,
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        physicalAddress,
        billingAddress
      );

      const index = users.indexOf(user);
      users[index] = updatedUser;

      // Write users to data.json
      fs.writeFile(filePath, JSON.stringify(users), (err) => {
        if (err) return res.status(500).send({ message: err.message });
        res.send({ message: "User updated successfully", data: updatedUser });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  });
});

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the backend of the application",
    id: faker.random.alphaNumeric(5).toUpperCase(),
  });
});

module.exports = { app: app, port: port };
