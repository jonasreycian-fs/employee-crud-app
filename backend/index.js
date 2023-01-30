// Staring point of the application with express server and cors, database using JSON file

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { faker } = require("@faker-js/faker");

const app = express();
const port = 3000;
const filePath = "./data.json";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the backend of the application",
    id: faker.random.alphaNumeric(5).toUpperCase(),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
