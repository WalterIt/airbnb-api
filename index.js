require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const Place = require("./models/Place.js");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const mime = require("mime-types");
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
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "afalj3ljfal4";
const bucket = "vs-booking-app";

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://vs-airbnb.vercel.app"],
    credentials: true,
  })
);

app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(process.env.MONGO_URL);

async function uploadToS3(path, originalFilename, mimeType) {
  const client = new S3Client({
    region: "us-west-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const parts = originalFilename.split(".");
  const ext = parts[parts.length - 1];
  const newFileName = Date.now() + "." + ext;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFileName,
      ContentType: mimeType,
      ACL: "public-read",
    })
  );

  return `https://${bucket}.s3.amazonaws.com/${newFileName}`;
}

// USER ROUTES
app.get("/api/test", async (req, res) => {
  res.json("TEST PAGE OK!");
});

app.post("/api/register", registerUser);
app.post("/api/login", loginUser);
app.get("/api/profile", userProfile);
app.post("/api/logout", userLogout);
// console.log({ __dirname });

// PLACES ROUTES

app.post("/api/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: "/tmp/" + newName,
  });

  const photoUrl = await uploadToS3(
    "/tmp/" + newName,
    newName,
    mime.lookup("/tmp/" + newName)
  );
  res.json(photoUrl);
});

const photosMiddleware = multer({ dest: "/tmp" });
app.post(
  "/api/upload",
  photosMiddleware.array("photos", 100),
  async (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname, mimeType } = req.files[i];
      const photoUrl = await uploadToS3(path, originalname, mimeType);
      uploadedFiles.push(photoUrl);
    }
    res.json(uploadedFiles);
  }
);

app.post("/api/places", createPlace);
app.get("/api/user-places", userPlaces);
app.get("/api/places/:id", GetPlace);
app.put("/api/places", updatePlace);
app.get("/api/places", getPlaces);

// BOOKINGS ROUTES
app.post("/api/bookings", createBooking);
app.get("/api/bookings", getBooking);

app.listen(4000);
