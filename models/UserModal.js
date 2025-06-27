const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: Number,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    favourite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "adminProfile",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
