require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const userRoute = require("./routes/user");

app.use(cors({ origin: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
    app.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
      //   home
      app.get("/", (req, res) => {
        res.send("Home Page");
      });

      //   user authentication
      app.use("/api/users/", userRoute);
    });
  })
  .catch((e) => {
    console.log(e);
  });
