const multer = require("multer");
const users = require("../models/user");
const authController = require("./authController");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/quicktime" ||
      file.mimetype === "video/x-msvideo" ||
      file.mimetype === "video/mpeg" ||
      file.mimetype === "video/x-m4v" ||
      file.mimetype === "video/webm" ||
      file.mimetype === "video/flv"
    ) {
      cb(null, true);
    } else {
      console.log("Unsupported file type: " + file.mimetype);
      cb(null, false);
    }
  },
});

const uploadToDB = async (req, res) => {
  const file = {
    videoFilePath: req.file.path,
  };
  const filter = { userID: req.currentUser.user_id };
  try {
   await users.findOne(filter).then((user) => {
      user.files.push(file);
      user.save();
      console.log("File saved for user:", user);
    });
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

const getAllFiles = async (req, res) => {
  const filter = { userID: req.currentUser.user_id };
  try {
   await users.findOne(filter).then((user) => {
      res.json(user.files);
    });
  } catch (error) {
    res.send(error);
    console.error("Error :", error);
  }
};

const getSingleFile = async (req, res) => {
  const filter = { userID: req.currentUser.user_id };
  try {
    var result;
    await users.findOne(filter).then((user) => {
      user.files.forEach((file) => {
        if(file.id===req.body.id){
          console.log(file);        
          result= file;
        }
      })
    });
    return result;
  } catch (error) {
    res.send(error);
    console.error("Error :", error);
  }
}

const updateFile = (req,res,file)=>{
  users.updateOne({userID:req.currentUser.user_id,'files._id':req.body.id},{
    $set:{
      "files.$":file
    }
  }).then((result)=>{
    console.log(result);
    res.send(result);
  }).catch((err)=>{
    console.error('Update failed:', err);
  })
}



module.exports = { upload, uploadToDB ,getAllFiles,getSingleFile,updateFile};
