const router = require("express").Router();
const userController = require("../controllers/userController");
const fileController = require("../controllers/fileController");
const mediaController = require("../controllers/mediaController");
const functions = require("../utils/functions");
// router.get('/:id',(req, res) => {
//     console.log(req.params);
//     mediaController.streamAudio(req, res,'./files/file_example_MP3_1MG.mp3');
// })

router.post("/login", async (req, res) => {
  userController.checkAndUpdateUser(req, res);
});

router.post("/upload", fileController.upload.single("video"), (req, res) => {
  console.log(req.file);
  console.log(req.file.path);
  console.log("uploading...");
  fileController.uploadToDB(req, res).then((result) => {
    res.send({ id: result });
  });
}),
  router.post("/convert/:id", async (req, res) => {
    console.log("in convert");
    const file = await fileController.getSingleFile(req, res);
    if (file) {
      const audioFilePath = functions.getAudioFilePath(file.videoFilePath);
     mediaController
        .convertVideoToAudio(file.videoFilePath, audioFilePath,req,res)
        .then(() => {
          file.audioFilePath = audioFilePath;
          fileController.updateFile(req, res, file);
        });
    } else {
      res.send("File not found");
    }
  });

router.get("/view-all", async (req, res) => {
  const files = await fileController.getAllFiles(req, res);
  res.json(files);
});

router.get("/view/:id", async (req, res) => {
  const file = await fileController.getSingleFile(req, res);
  if (file) {
    res.send(file);
  } else {
    res.send("File not found");
  }
});

router.get("/play/:id", async (req, res) => {
  const file = await fileController.getSingleFile(req, res);
  if (file) {
    mediaController.streamAudio(req, res, file.audioFilePath);
  } else {
    res.send("File not found");
  }
});

router.post("/delete/:id", async (req, res) => {
  const file = await fileController.getSingleFile(req, res);
  if (file) {
    if (file.videoFilePath) functions.deleteFile(file.videoFilePath);
    if (file.audioFilePath) functions.deleteFile(file.audioFilePath);
    fileController.deleteFile(req, res);
  } else {
    res.send("File not found");
  }
});

router.get("/download/:id", async (req, res) => {
  const file = await fileController.getSingleFile(req, res);
  if (file) {
    res.download(file.audioFilePath, (err) => {
      if (err) {
        console.error("Download failed:", error);
        res.send("Download failed");
      }
    });
  } else {
    res.send("File not found");
  }
});

module.exports = router;
