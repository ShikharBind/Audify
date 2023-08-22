require("dotenv").config();
const axios = require("axios");

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

const getLinks = () => {
  getToken()
    .then((accessToken) => {
      console.log(`Access Token: ${accessToken}`);
      const ACCESS_TOKEN = accessToken;
      const PLAYLIST_ID = "4fxCUAyXc9TeZ0mb6Nnm9P?si=a61f2591a4a14226";
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
          const tracks = {};
          playlist.tracks.items.forEach((item, index) => {
            const track = item.track;
            trackname = `${track.name} - ${track.artists[0].name}`;
            // link = searchYouTube(trackname);
            link = `https://www.youtube.com/watch?v=${trackname}`;
            tracks[`${trackname}`] = link;
          });
          console.log(tracks);
        } catch (error) {
          console.error("Error fetching playlist details:", error);
        }
      };
      getPlaylistDetails();
    })
    .catch((error) => {
      console.error("Error getting access token:", error);
    });
};
module.exports = { getLinks };
