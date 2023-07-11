import React, { useState, useContext } from "react";
import { AccessTokenContext } from './AccessTokenContext';

import DownloadButton from './DownloadButton';
import ConvertButton from './ConvertButton';

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
    if(isConvertDisabled === false){
      setIsConvertDisabled(true);
      setIsConverted(false);
    }
  };

  const handleUpload = async () => {
    if (videoFile) {
      const formData = new FormData();
      formData.append("video", videoFile);

      try {
        const response = await fetch("http://localhost:4000/upload", {
            headers:{
                Authorization: `Bearer ${accessToken}`,
              },  
            method: "POST",
            body: formData,
        });
        // console.log(accessToken);
        const data = await response.json();
        setFileId(data.id);
        setIsConvertDisabled(false);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
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
          {!isConverted && (
            <ConvertButton fileId={fileId} setConverted={setIsConverted} />
          )}

        </div>
      )}
    </div>
  );
};

export default FileUploader;