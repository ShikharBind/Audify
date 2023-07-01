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

const app = express();
const connectDB = require("./database/db");
const userRoute = require("./routes/userRoutes");
const mediaController = require("./controllers/mediaController");
const fileController = require("./controllers/fileController");
const authController = require("./controllers/authController");

const functions = require('./utils/functions');

const PORT = process.env.PORT || 3000;
connectDB();

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

console.log(functions.getAudioFilePath('/uploads/1688234602585-sample-mp4-file-small.mp4'));
app.use("/", userRoute);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
