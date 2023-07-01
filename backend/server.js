require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs= require("fs");
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const multer = require('multer');

const app = express();
const userRoute = require("./routes/userRoutes");
const mediaController = require("./controllers/mediaController");
const fileController = require("./controllers/fileController");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log(e);
  });


//   home
app.get("/", (req, res) => {
  // const filePath = "./files/file_example_MP3_1MG.mp3";
  // mediaController.streamAudio(req, res,filePath);
  return res.render('home');
});

app.post("/upload",fileController.upload.single('video'), (req, res) => {
  console.log(req.body);
  console.log(req.file);

  return res.redirect("/");
})

//   user authentication
app.use("/user/", userRoute);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
