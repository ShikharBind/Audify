import { AccessTokenContext } from './AccessTokenContext';
import React, { useContext } from "react";

const DownloadButton = ({ fileId }) => {
  const { accessToken } = useContext(AccessTokenContext);
  
  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:4000/download/${fileId}`, {
        headers:{
              Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "audioFile.mp3"; // Set the desired file name
        link.click();
        URL.revokeObjectURL(url);
      } else {
        console.error("Download failed:", response.statusText);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <button className="download-button" onClick={handleDownload}>
      Download
    </button>
  );
};

export default DownloadButton;