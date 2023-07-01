const users = require("../models/user");

const newUserData = async (decodeValue, req, res) => {
  const newUser = new users({
    name: decodeValue.email.split("@")[0],
    email: decodeValue.email,
    userID: decodeValue.user_id,
    email_verified: decodeValue.email_verified,
    auth_time: decodeValue.auth_time,
    files:[]
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

const checkAndUpdateUser= async (req, res) => {
   // checking if user already exists
   const decodeValue = req.currentUser;
  try {
     const userExists = await users.findOne({ userID: decodeValue.user_id });
      
     if (userExists) {
       updateUserData(decodeValue, req, res);
     } else {
       // res.send(decodeValue);
       newUserData(decodeValue, req, res);
     }
  } catch (error) {
    console.log(error);
    
  }
}

module.exports = {
  checkAndUpdateUser
};
