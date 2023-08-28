require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const archiver = require("archiver");
const path = require("path");

const mediaController = require("../controllers/mediaController");
const functions = require("../utils/functions");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const API_KEY = process.env.YOUTUBE_API_KEY;

const searchYouTube = async (searchTerm) => {
  try {
    var link;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: API_KEY,
          q: searchTerm,
          part: "snippet",
          type: "video",
          maxResults: 1,
        },
      }
    );

    const videos = response.data.items;
    const youtubeLink = `https://www.youtube.com/watch?v=${videos[0].id.videoId}`;
    return youtubeLink;
  } catch (error) {
    console.error("Error searching YouTube:", error);
    res.status(400).send({ success: false, message: error });
  }
};

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

const spotifyLinkToZip = (playlistLink, req, res) => {
  getToken()
    .then((accessToken) => {
      console.log(`Access Token: ${accessToken}`);
      const ACCESS_TOKEN = accessToken;
      parts = playlistLink.split("/");
      const PLAYLIST_ID = parts[parts.length - 1];
      const getPlaylistDetails = async () => {
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`,
            {
              headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
              },
            }
          );
          const playlist = response.data;

          console.log("Playlist Name:", playlist.name);
          console.log("Total Tracks:", playlist.tracks.total);
          // fs.mkdir(`./uploads/${req.currentUser.user_id}/`)
          datenow = Date.now();
          folderName = `./uploads/${req.currentUser.user_id}/${playlist.name}${datenow}/`;
          fs.mkdir(folderName, (err) => {
            if (err) {
              console.error("Error creating directory:", err);
              res.status(400).send({ success: false, message: err });
            } else {
              console.log("Directory created successfully");
            }
          });
          var tracks = {};
          const promises = playlist.tracks.items.map(async (item, i) => {
            const track = item.track;
            const name = `${track.name} - ${track.artists[0].name}`;
            const characters = name.split("");
            const trackname = characters
              .filter((char) => char !== "/")
              .join("");

            console.log(trackname);
            const link = await searchYouTube(trackname);
            tracks[trackname] = link;
            const videoFilePath = tracks[trackname];
            const audioFilePath = `${folderName}${
              i + 1
            }. ${functions.getAudioFilePath(trackname)}`;
            await mediaController.convertVideoURLToAudio(
              videoFilePath,
              audioFilePath
            );
          });

          await Promise.all(promises);
          console.log(tracks);
          return {
            folderName: folderName,
            playlistName: playlist.name + datenow,
          };
        } catch (error) {
          console.error("Error fetching playlist details:", error);
          res.status(400).send({ success: false, message: error });
        }
      };
      getPlaylistDetails().then((result) => {
        const folderToZip = result.folderName;
        const zipFileName = `${result.playlistName}.zip`;
        const outputDirectory = `./uploads/${req.currentUser.user_id}/`;
        const outputPath = path.join(outputDirectory, zipFileName);
        const output = fs.createWriteStream(outputPath);
        const archive = archiver("zip", {
          zlib: { level: 9 },
        });
        archive.pipe(output);
        archive.directory(folderToZip, false);
        archive.finalize();
        output.on("close", () => {
          console.log(`ZIP file created and stored in: ${outputPath}`);
          res.send({ file: outputDirectory + zipFileName });
        });
        archive.on("error", (err) => {
          console.error("Error creating ZIP file:", err);
          res.status(400).send({ success: false, message: err });
        });
      });
    })
    .catch((error) => {
      console.error("Error getting access token:", error);
      res.status(400).send({ success: false, message: error });
    });
};
module.exports = { spotifyLinkToZip };
