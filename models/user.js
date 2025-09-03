const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,

      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "image/user.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();

  const hashpassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashpassword;
  next();
});
userSchema.static("matchPasswordAndGenerateToken", async function(email,password){
    const user = await this.findOne({email});
    if(!user)throw new Error("User not found");
    console.log(user);
    const salt = user.salt;
    const hashedpassword =  user.password;
    const inputpassword = createHmac("sha256", salt)
    .update(password)   
    .digest("hex");
    if(hashedpassword !== inputpassword) throw new Error("Invalid password");
    const token = createToken(user);
    return token;
})

const User = model("User", userSchema);
module.exports = User;
