# Audify - Multimedia Conversion Website

Audify is a multimedia conversion website developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform empowers users to perform video-to-audio conversion via FFmpeg. In addition to video conversion, Audify introduces an innovative feature enabling users to download Spotify playlists as zip files by integrating FFmpeg, YouTube, and external APIs.

## Features

- Convert videos to audio files using FFmpeg.
- Secure and personalized user authentication through Firebase.
- **Innovative Feature**: Download Spotify playlists as zip files, leveraging FFmpeg, YouTube, and APIs.
- Utilize Axios for Spotify and YouTube API calls.
- Use ytdl-core for extracting videos from YouTube links.

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account (for database)
- Firebase project (for authentication)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/ShikharBind/Audify.git
```

2. Navigate to the project directory:

```sh
cd Audify
```

3. Install backend dependencies:

```sh
cd backend
npm install
```

4. Configure backend:

   - Rename `.env.example` to `.env` and provide necessary environment variables.
   - Configure MongoDB Atlas connection URL and Firebase configuration.

5. Install frontend dependencies:

```sh
cd ../frontend
npm install
```

6. Configure frontend:

   - Rename `.env.example` to `.env` and provide necessary environment variables.
   - Set the REACT_APP_BACKEND_URL to point to your backend API.

7. Run the application:

   - Start the backend server:

   ```sh
   cd ../backend
   npm start
   ```

   - Start the frontend development server:

   ```sh
   cd ../frontend
   npm start
   ```

8. Access the application in your web browser:

   Open `http://localhost:3000` in your web browser.

## Project Structure

- `backend/`: Node.js backend code
- `frontend/`: React.js frontend code
- `ffmpeg/`: FFmpeg executable for video-to-audio conversion

## Links

- Project Repository: [https://github.com/ShikharBind/Audify](https://github.com/ShikharBind/Audify)
