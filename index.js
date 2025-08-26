const express = require("express");
const app = express();
const PORT = 8001;
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/Blog");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");


const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");







app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

mongoose.connect("mongodb://localhost:27017/blog-app")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static("public"));


app.get("/", async(req, res) => {
  const allBlogs = await Blog.find({}).sort({"createdAt": -1});
  res.render("home",{
    user: req.user,
    blogs: allBlogs,
  });
});



app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
