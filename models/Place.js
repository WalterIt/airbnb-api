const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlaceSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: [true, "Please, add a title!"],
  },
  address: {
    type: String,
    required: [true, "Please, add an address!"],
  },
  description: {
    type: String,
    required: [true, "Please, add a description!"],
    trim: true,
  },
  perks: [String],
  extraInfo: String,
  checkIn: String,
  checkOut: String,
  maxGuests: Number,
  photos: [String],
  price: Number,
});

const PlaceModel = mongoose.model("Place", PlaceSchema);

module.exports = PlaceModel;
