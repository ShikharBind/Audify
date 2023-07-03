import React, { useState, useContext } from "react";
import { AccessTokenContext } from './AccessTokenContext';
import DownloadButton from './DownloadButton';

const FileUploader = () => {
  const { accessToken } = useContext(AccessTokenContext);
  const [videoFile, setVideoFile] = useState(null);
  const [fileId, setFileId] = useState(null);

  const [isConvertDisabled, setIsConvertDisabled] = useState(true);
  const [isConverted, setIsConverted] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file.type.startsWith("video/")) {
      setVideoFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file.type.startsWith("video/")) {
      setVideoFile(file);
    }
  };

  const handleUpload = async () => {
    if (videoFile) {
      const formData = new FormData();
      formData.append("videoFile", videoFile);

      try {
        const response = await fetch("http://localhost:3000/upload", {
            headers:{
                Authorization: `Bearer ${accessToken}`,
              },  
            method: "POST",
            body: formData,
        });
        console.log(accessToken);
        const data = await response.json();
        setFileId(data.id);
        setIsConvertDisabled(false);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleConvert = (id) => {
    // if (videoFile) {
    //   const formData = new FormData();
    //   formData.append("video", videoFile);
  
      fetch(`http://localhost:3000/convert/${id}`, {
        headers:{
            Authorization: `Bearer ${accessToken}`,
          },  
        method: "POST",
        // body: formData,
      })
        .then((response) => {
          // Handle successful conversion
          console.log("Conversion successful");
          setIsConverted(true);
        })
        .catch((error) => {
          // Handle conversion error
          console.error("Conversion error:", error);
        });
    // }
  };

  return (
    <div className="file-uploader" onDrop={handleDrop} onDragOver={handleDragOver}>
      <label htmlFor="upload-input" className="upload-label">
        <input
          type="file"
          id="upload-input"
          accept=".mp4, .mov, .avi"
          onChange={handleFileSelect}
        />
        <div className="upload-container">
          <span className="upload-icon">&#8679;</span>
          <p className="upload-text">Drag and drop a video file here or click to upload.</p>
        </div>
      </label>
      {videoFile && (
        <div className="file-actions">
          <button className="upload-button" onClick={handleUpload} >
            Upload
          </button>
          {isConverted && fileId && <DownloadButton fileId={fileId} />}
          { !isConverted && ( 
            <button
              className="convert-button"
              onClick={() => handleConvert(fileId)}
              disabled={isConvertDisabled || !fileId}
            >
              Convert to Audio
            </button>
          )}

        </div>
      )}
    </div>
  );
};

export default FileUploader;
