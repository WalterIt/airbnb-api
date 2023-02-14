const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please, add a name!"],
  },
  email: {
    type: String,
    required: [true, "Please, add an email!"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email!",
    ],
  },
  password: {
    type: String,
    required: [true, "Please, add a Password!"],
    minLength: [6, "Password must have at least 6 characters!"],
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
