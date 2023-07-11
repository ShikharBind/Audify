import React, { useState } from "react";
import ConvertButton from './ConvertButton';
import DownloadButton from './DownloadButton';

import './URLconverter.css';

const URLConverter = () => {
  const [videoURL, setVideoURL] = useState("");
  const [isConvertDisabled, setIsConvertDisabled] = useState(true);
  const [isConverted, setIsConverted] = useState(false);
  const [fileId, setFileId] = useState("");

  const handleURLChange = (event) => {
    setVideoURL(event.target.value);
    setIsConvertDisabled(false);
    setIsConverted(false);
    setFileId("");
  };

  const handleConverted = (id) => {
    setFileId(id);
    setIsConverted(true);
  };

  return (
    <div className="url-converter-container">
        <div className="url-converter">
        <input
            type="text"
            placeholder="Enter video URL"
            value={videoURL}
            onChange={handleURLChange}
        />
        <ConvertButton
            fileId={videoURL}
            isConvertDisabled={isConvertDisabled}
            setConverted={handleConverted}
        />
        {isConverted && fileId && <DownloadButton fileId={fileId} />}
        </div>
    </div>
  );
};

export default URLConverter;
