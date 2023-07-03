const admin = require("../config/firebase.config");
const users = require("../models/user");
const userController = require("../controllers/userController");

const verifyIdToken = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ message: "Invalid Token" });
  }

  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  if (token) {
    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      console.log(decodeValue);
      if (!decodeValue) {
        return res
          .status(500)
          .json({ success: false, message: "Unauthorized User" });
      }
      return decodeValue;
    } catch (e) {
      if (e.code === "auth/id-token-expired") {
        console.log("token expired");
      }
      console.log("in auth catch", e);
      return res.status(500).send({ success: false, message: e });
    }
  } else {
    res.status(500).send({ message: "Invalid Token" });
  }
};

module.exports = { verifyIdToken };
