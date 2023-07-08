const { on } = require("events");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const ytdl = require('ytdl-core');

function base64ToMp3(base64String, outputFilePath) {
  const base64Data = base64String.replace(/^data:audio\/mp3;base64,/, "");

  fs.writeFile(outputFilePath, base64Data, "base64", (error) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Conversion successful!");
    }
  });
}
function mp3ToBase64(filePath) {
  const fileData = fs.readFileSync(filePath);
  const base64String = Buffer.from(fileData).toString("base64");

  return base64String;
}

const convertVideoToAudio = async(videoFilePath, audioFilePath, req, res) => {
  return new Promise(async (resolve, reject) => {
   await ffmpeg(videoFilePath)
      .output(audioFilePath)
      .noVideo()
      .audioCodec("libmp3lame")
      .on("end", () => {
        console.log("Conversion complete");
        resolve();
      })
      .on("error", (error) => {
        console.error("Error:", error);
        res.status(400).send({ success: false, message: error });
      })
      .run()});
};

async function convertVideoURLToAudio(videoUrl, outputPath, req,res) {

  return new Promise(function(resolve, reject) {
    try {
      const videoReadableStream = ytdl(videoUrl, { quality: 'highestaudio' });
      const outputStream = fs.createWriteStream(outputPath);
  
      ffmpeg(videoReadableStream)
        .output(outputStream)
        .noVideo()
        .format('mp3')
        .on('end', () => {
          console.log('Conversion complete!');
          resolve();
        })
        .on('error', (err) => { 
          res.status(400).send({ success: false, message: error });
          console.error('Error converting video:', err);
        })
        .run();
    } catch (error) {
      console.error('Error downloading video:', error);
      res.status(400).send({ success: false, message: `Error processing video: ${error}`});
    }
  })
  
}

const streamAudio =(req, res, audioFilePath)=>{
 try {
  console.log("playing audio"+audioFilePath);
   const stat = fs.statSync(audioFilePath);
 
   res.setHeader('Content-Type', 'audio/mpeg');
   res.setHeader('Content-Length', stat.size);
 
   const readStream = fs.createReadStream(audioFilePath);
   readStream.pipe(res);
 } catch (error) {
  console.log(error);
  res.status(400).send({ success: false, message: error });

 }
}

module.exports = { base64ToMp3, mp3ToBase64, convertVideoToAudio,convertVideoURLToAudio, streamAudio };
