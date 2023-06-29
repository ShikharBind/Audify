const admin = require("../config/firebase.config");
const users = require("../models/users");
const router = require("express").Router();

const newUserData = async (decodeValue, req, res) => {
  const newUser = new users({
    name: decodeValue.email.split("@")[0],
    email: decodeValue.email,
    userID: decodeValue.user_id,
    email_verified: decodeValue.email_verified,
    auth_time: decodeValue.auth_time,
  });
  try {
    console.log("here");
    const savedUser = await newUser.save();
    console.log(newUser);
    console.log(savedUser);
    res.status(200).send({ user: savedUser });
  } catch (error) {
    res.status(400).send({ success: false, message: error });
  }
};

const updateUserData = async (decodeValue, req, res) => {
  const filter = { userID: decodeValue.user_id };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await users.findOneAndUpdate(
      filter,
      { auth_time: decodeValue.auth_time },
      options
    );
    res.status(200).send({ user: result });
  } catch (error) {
    res.status(400).send({ success: false, message: error });
  }
};

router.post("/login", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ message: "Invalid Token" });
  }

  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    console.log(decodeValue);
    if (!decodeValue) {
      return res
        .status(500)
        .json({ success: false, message: "Unauthorized User" });
    }

    // checking if user already exists
    const userExists = await users.findOne({ userID: decodeValue.user_id });

    if (userExists) {
      updateUserData(decodeValue, req, res);
    } else {
      // res.send(decodeValue);
      newUserData(decodeValue, req, res);
    }
  } catch (e) {
    if(e.code==="auth/id-token-expired"){
      console.log('token expired');
    }
    return res.status(500).send({ success: false, message: e });
  }
});

module.exports = router;
