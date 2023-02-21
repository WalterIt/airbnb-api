const express = require("express");
const jwt = require("jsonwebtoken");
const Place = require("../models/Place.js");
const app = express();

app.use(express.json());

const jwtSecret = "afalj3ljfal4";

const createPlace = async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (error, userData) => {
    if (error) throw error;
    try {
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      res.json(placeDoc);
    } catch (error) {
      res.status(422).json(error);
    }
  });
};

const userPlaces = (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, jwtSecret, {}, async (error, userData) => {
    if (error) throw error;
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
};

const GetPlace = async (req, res) => {
  const { id } = req.params;

  res.json(await Place.findById(id));
};

const updatePlace = async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (error, userData) => {
    if (error) throw error;
    const placeDoc = await Place.findById(id);

    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });

      await placeDoc.save();
      res.json("OK");
    }
  });
};

const getPlaces = async (req, res) => {
  res.json(await Place.find());
};

module.exports = {
  createPlace,
  userPlaces,
  GetPlace,
  updatePlace,
  getPlaces,
};
