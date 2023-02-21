require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const {
  registerUser,
  loginUser,
  userProfile,
  userLogout,
} = require("./controllers/userController");
const {
  userPlaces,
  createPlace,
  GetPlace,
  updatePlace,
  getPlaces,
} = require("./controllers/placeController");
const {
  createBooking,
  getBooking,
} = require("./controllers/bookingController");
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "afalj3ljfal4";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

mongoose.connect(process.env.MONGO_URI);

// USER ROUTES
app.get("/test", (req, res) => {
  res.json("Test OK!");
});

app.post("/register", registerUser);
app.post("/login", loginUser);
app.get("/profile", userProfile);
app.post("/logout", userLogout);
// console.log({ __dirname });

// PLACES ROUTES

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", createPlace);
app.get("/user-places", userPlaces);
app.get("/places/:id", GetPlace);
app.put("/places", updatePlace);
app.get("/places", getPlaces);

// BOOKINGS ROUTES
app.post("/bookings", createBooking);
app.get("/bookings", getBooking);

app.listen(4000);
