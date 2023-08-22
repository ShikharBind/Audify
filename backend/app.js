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
spotifyYtController.getLinks(
  "https://open.spotify.com/playlist/2RODZc2BMf6nLbmd8jYxWG?si=af8fe3b7d54f4f00"
);
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
