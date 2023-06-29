function base64ToMp3(base64String, outputFilePath) {
    const base64Data = base64String.replace(/^data:audio\/mp3;base64,/, '');
  
    fs.writeFile(outputFilePath, base64Data, 'base64', (error) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Conversion successful!');
      }
    });
  }
  function mp3ToBase64(filePath) {
    const fileData = fs.readFileSync(filePath);
    const base64String = Buffer.from(fileData).toString('base64');
  
    return base64String;
  }
  
  module.exports ={base64ToMp3, mp3ToBase64};