const Booking = require("../models/Booking.js");
const jwt = require("jsonwebtoken");
const jwtSecret = "afalj3ljfal4";

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (error, userData) => {
      if (error) throw error;
      resolve(userData);
    });
  });
}

const createBooking = async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberGuests, name, email, phone, price } =
    req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberGuests,
    name,
    email,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((error) => {
      throw error;
    });
};

const getBooking = async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
};

module.exports = { createBooking, getBooking };
