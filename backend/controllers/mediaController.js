const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

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

const convertVideoToAudio = (videoFilePath, audioFilePath) => {
  try {
    ffmpeg(videoFilePath)
      .output(audioFilePath)
      .noVideo()
      .audioCodec("libmp3lame")
      .on("end", (callback) => {
        console.log("Conversion complete");
      })
      .on("error", (error) => {
        console.error("Error:", error);
      })
      .run();
    console.log("Conversion complete");
  } catch (error) {
    console.error("Conversion failed:", error);
    res.status(400).send({ success: false, message: error });
  }
};

const streamAudio =(req, res, audioFilePath)=>{
 try {
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

module.exports = { base64ToMp3, mp3ToBase64, convertVideoToAudio, streamAudio };
