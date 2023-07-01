const path = require('path');
const getAudioFilePath= (videoFilePath) =>{
    const directory = path.dirname(videoFilePath);
    const basename = path.basename(videoFilePath, path.extname(videoFilePath));
    const newFileName = `${basename}${'.mp3'}`;
    return path.join(directory, newFileName);
}


module.exports={
    getAudioFilePath
}