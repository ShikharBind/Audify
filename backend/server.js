require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const userRoute = require("./routes/userRoutes");

app.use(cors({ origin: true }));
app.use(express.json());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log(e);
  });



//   home
app.get("/", (req, res) => {
  res.send("Home Page");
});

//   user authentication
app.use("/api/users/", userRoute);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
