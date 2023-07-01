const router = require("express").Router();
const userController = require("../controllers/userController");
const fileController = require("../controllers/fileController");


router.post("/login", async (req, res) => {
    userController.checkAndUpdateUser(req, res);
});

router.post("/upload",fileController.upload.single('video'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    console.log(req.file.path);
    console.log("uploading...");
    fileController.uploadToDB(req,res);
    return res.redirect("/");
  }),

module.exports = router;
