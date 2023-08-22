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
    videos.forEach((video, index) => {
      const youtubeLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      console.log(youtubeLink);
      link = youtubeLink;
    });
    return link;
  } catch (error) {
    console.error("Error searching YouTube:", error);
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

const getLinks = (playlistLink) => {
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
          folderName = `./uploads/${playlist.name}${datenow}/`;
          fs.mkdir(folderName, (err) => {
            if (err) {
              console.error("Error creating directory:", err);
            } else {
              console.log("Directory created successfully");
            }
          });
          const tracks = {};
          playlist.tracks.items.forEach((item, index) => {
            const track = item.track;
            trackname = `${track.name} - ${track.artists[0].name}`;
            // link = `https://www.youtube.com/watch?v=${trackname}`;
            link =
              "https://www.youtube.com/watch?v=JtPbk7WvHAQ&ab_channel=editorfriendly";
            tracks[`${trackname}`] = link;
          });
          console.log(tracks);
          var i = 1;
          for (var v in tracks) {
            console.log(tracks[v]);
            const videoFilePath = tracks[v];
            const audioFilePath =
              folderName + i + ". " + functions.getAudioFilePath(v);
            await mediaController
              .convertVideoURLToAudio(videoFilePath, audioFilePath)
              .then(() => {
                //   const file = {
                //     videoFilePath: videoFilePath,
                //     audioFilePath: audioFilePath,
                //   };
                //   fileController.uploadToDB(req, res, file).then((result) => {
                //     res.send({ id: result });
                //   });
              });
            i++;
          }
          return {
            folderName: folderName,
            playlistName: playlist.name + datenow,
          };
        } catch (error) {
          console.error("Error fetching playlist details:", error);
        }
      };
      getPlaylistDetails().then((result) => {
        const folderToZip = result.folderName; // Replace with the actual path of the folder you want to zip
        const zipFileName = `${result.playlistName}.zip`; // Replace with the desired name for the ZIP file
        const outputDirectory = "./uploads/"; // Replace with the desired output directory

        const outputPath = path.join(outputDirectory, zipFileName);

        const output = fs.createWriteStream(outputPath);
        const archive = archiver("zip", {
          zlib: { level: 9 }, // Compression level (0-9)
        });

        archive.pipe(output);

        archive.directory(folderToZip, false); // Add the entire folder to the archive

        archive.finalize();

        output.on("close", () => {
          console.log(`ZIP file created and stored in: ${outputPath}`);
        });

        archive.on("error", (err) => {
          console.error("Error creating ZIP file:", err);
        });
      });
    })
    .catch((error) => {
      console.error("Error getting access token:", error);
    });
};
module.exports = { getLinks };
