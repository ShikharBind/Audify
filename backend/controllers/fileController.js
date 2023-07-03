const multer = require("multer");
const users = require("../models/user");
const authController = require("./authController");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, `./uploads/${req.currentUser.user_id}`);
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
  var response;
  try {
    await users
      .findOne(filter)
      .then((user) => {
        user.files.push(file);
        return user.save();
      })
      .then((updatedUser) => {
        console.log("File saved for user:", updatedUser);
        const newFileId = updatedUser.files[updatedUser.files.length - 1]._id;
        console.log("New file ID:", newFileId);
        response = newFileId;
      });
    return response;
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

const getAllFiles = async (req, res) => {
  const filter = { userID: req.currentUser.user_id };
  var response;
  try {
    await users.findOne(filter).then((user) => {
      response = user.files;
    });
    return response;
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
        if (file.id === req.params.id) {
          console.log(file);
          result = file;
        }
      });
    });
    return result;
  } catch (error) {
    res.send(error);
    console.error("Error :", error);
  }
};

const updateFile = (req, res, file) => {
  users
    .updateOne(
      { userID: req.currentUser.user_id, "files._id": req.params.id },
      {
        $set: {
          "files.$": file,
        },
      }
    )
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.error("Update failed:", err);
    });
};
const deleteFile = (req, res) => {
  users
    .updateOne(
      { userID: req.currentUser.user_id },
      {
        $pull: {
          files: {
            _id: req.params.id,
          },
        },
      }
    )
    .then((result) => {
      console.log(result);
      res.send("File successfully deleted");
    })
    .catch((err) => {
      console.error("Could not delete", err);
    });
};

module.exports = { upload, uploadToDB, getAllFiles, getSingleFile, updateFile ,deleteFile};
