const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataModel = new Schema(
  {
    videoURL: {
      type: String,
      required: true,
    },
    audioURL: {
      type: String,
      required: true,
    },
    subtitles: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("data", dataModel);
