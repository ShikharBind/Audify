require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const multer = require("multer");
const ytdl = require("ytdl-core");
const axios = require("axios");

const app = express();
const connectDB = require("./database/db");
const userRoute = require("./routes/userRoutes");
const mediaController = require("./controllers/mediaController");
const fileController = require("./controllers/fileController");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const spotifyYtController = require("./controllers/spotifyYtController");

const functions = require("./utils/functions");

const PORT = process.env.PORT || 3000;
connectDB();
// spotifyYtController.spotifyLinkToZip(
//   "https://open.spotify.com/playlist/615g8yBEbeiIGDRRAfRZ95?si=905510e6b6714eac"
// );
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(async (req, res, next) => {
  console.log("in use");
  req.currentUser = await authController.verifyIdToken(req, res);
  console.log(req.currentUser);
  next();
  console.log("out use");
});

app.use("/", userRoute);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
