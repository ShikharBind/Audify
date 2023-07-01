const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    email_verified: {
      type: Boolean,
      required: true,
    },
    auth_time: {
      type: String,
      required: true,
    },
    files:[
      {
        filename:{
          type: String,
        },
        videoFilePath:{
          type: String,
          required: true
        },
        audioFilePath: {
          type: String,
        },
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userModel);
