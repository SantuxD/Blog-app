const express = require("express");
const app = express();
const PORT = 8001;
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const userRouter = require("./routes/user");







app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

mongoose.connect("mongodb://localhost:27017/blog-app")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))


app.get("/", (req, res) => {
  res.render("home",{
    user: req.user
  });
});



app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
