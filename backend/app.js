require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const multer = require("multer");
const ytdl = require("ytdl-core");
const axios = require("axios");

const app = express();
const connectDB = require("./database/db");
const userRoute = require("./routes/userRoutes");
const mediaController = require("./controllers/mediaController");
const fileController = require("./controllers/fileController");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");

const functions = require("./utils/functions");

const PORT = process.env.PORT || 3000;
connectDB();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const getToken = async () => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    null,
    {
      params: {
        grant_type: "client_credentials",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
    }
  );
  return response.data.access_token;
};

// Get an access token
// getToken()
//   .then((accessToken) => {
//     console.log(`Access Token: ${accessToken}`);

//     const ACCESS_TOKEN = accessToken; // Replace with the access token you obtained

//     // Replace with the playlist ID you want to fetch details for
//     const PLAYLIST_ID = "00PK3kZHUfMcpL6ldpQDHX?si=4e431d9289424063";
//     const getPlaylistDetails = async () => {
//       try {
//         const response = await axios.get(
//           `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`,
//           {
//             headers: {
//               Authorization: `Bearer ${ACCESS_TOKEN}`,
//             },
//           }
//         );
//         const playlist = response.data;
//         console.log("Playlist Name:", playlist.name);
//         console.log("Total Tracks:", playlist.tracks.total);

//         // Loop through the tracks and access their details
//         const tracks = [];
//         playlist.tracks.items.forEach((item, index) => {
//           const track = item.track;
//           // console.log(track);
//           // console.log(`${index + 1}. ${track.name} - ${track.artists[0].name}`);
//           tracks.push(`${track.name} ${track.artists[0].name}`);
//         });
//         console.log(tracks);
//       } catch (error) {
//         console.error("Error fetching playlist details:", error);
//       }
//     };

//     // Call the function to get playlist details
//     getPlaylistDetails();
//     // Make requests to the Spotify API with this access token
//   })
//   .catch((error) => {
//     console.error("Error getting access token:", error);
//   });

const API_KEY = process.env.YOUTUBE_API_KEY; // Replace with your actual API key
const searchTerm = "Despacito"; // Replace with your desired search term

const searchYouTube = async () => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: API_KEY,
          q: searchTerm,
          part: "snippet",
          type: "video",
          maxResults: 5, // Number of results you want
        },
      }
    );

    const videos = response.data.items;
    videos.forEach((video, index) => {
      const youtubeLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      console.log(youtubeLink);
    });
  } catch (error) {
    console.error("Error searching YouTube:", error);
  }
};

// Call the function to search YouTube
searchYouTube();

app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(async (req, res, next) => {
  console.log("in use");
  req.currentUser = await authController.verifyIdToken(req, res);
  console.log(req.currentUser);
  next();
  console.log("out use");
});

app.use("/", userRoute);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
