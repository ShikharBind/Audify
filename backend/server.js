require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs= require("fs");
const ffmpeg = require('fluent-ffmpeg');


const app = express();
const userRoute = require("./routes/userRoutes");
const mediaController = require("./controllers/mediaController");

app.use(cors({ origin: true }));
app.use(express.json());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

function convertVideoToAudio(videoFilePath, audioFilePath, callback) {
  ffmpeg(videoFilePath)
    .output(audioFilePath)
    .noVideo()
    .audioCodec('libmp3lame')
    .on('end', () => {
      console.log('Conversion complete');
      callback(null);
    })
    .on('error', (error) => {
      console.error('Error:', error);
      callback(error);
    })
    .run();
}
const videoFilePath = './files/sample-mp4-file-small.mp4';
const audioFilePath = './files/audio.mp3';

mediaController.convertVideoToAudio(videoFilePath, audioFilePath, (error) => {
  if (error) {
    console.error('Conversion failed:', error);
  } else {
    console.log('Conversion successful!');
  }
});


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
  const filePath = './files/file_example_MP3_1MG.mp3';
  const stat = fs.statSync(filePath);

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Length', stat.size);

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

//   user authentication
app.use("/api/users/", userRoute);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
