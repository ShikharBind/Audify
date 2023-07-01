const path = require('path');
const fs = require("fs");

const getAudioFilePath= (videoFilePath) =>{
    const directory = path.dirname(videoFilePath);
    const basename = path.basename(videoFilePath, path.extname(videoFilePath));
    const newFileName = `${basename}${'.mp3'}`;
    return path.join(directory, newFileName);
}

const createFolder = (folderPath) =>{
    fs.mkdir(folderPath, { recursive: true }, (error) => {
        if (error) {
          console.error('Failed to create folder:', error);
        } else {
          console.log('Folder created successfully');
        }
      });
}


module.exports={
    getAudioFilePath,
    createFolder
}