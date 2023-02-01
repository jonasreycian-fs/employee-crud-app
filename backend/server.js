const { app, port } = require("./app");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
