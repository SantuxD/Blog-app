const express = require("express");
const app = express();
const PORT = 8001;
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
