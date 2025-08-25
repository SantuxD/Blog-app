const express = require("express");
const app = express();
const PORT = 8001;
const path = require("path");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

mongoose.connect("mongodb://localhost:27017/blog-app")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("home");
});

app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
