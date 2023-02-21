const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

const jwtSecret = "afalj3ljfal4";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(422).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passwordIsCorrect = bcrypt.compareSync(password, userDoc.password);
      if (passwordIsCorrect) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret,
          {},
          (error, token) => {
            if (error) throw error;

            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json("Email or Password is not Correct!");
      }
    } else {
      res.json("Email Not Found!");
    }
  } catch (error) {
    res.status(422).json(error);
  }
};

const userProfile = (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
      if (error) throw error;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
};

const userLogout = (req, res) => {
  res.cookie("token", "").json(true);
};

module.exports = {
  registerUser,
  loginUser,
  userProfile,
  userLogout,
};
