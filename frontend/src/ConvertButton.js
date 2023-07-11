import React, { useContext } from "react";
import { AccessTokenContext } from './AccessTokenContext';

const ConvertButton = ({ fileId, isConvertDisabled, setConverted }) => {
  const { accessToken } = useContext(AccessTokenContext);

  const handleConvert = () => {
    if (fileId.startsWith("http")) {
      // Conversion for URL
      fetch(`http://localhost:4000/convert-url`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ videoURL: fileId }),
      })
        .then(async (response) => {
          if (response.ok) {
            // Handle successful conversion
            const data = await response.json();
            console.log(data.id)
            console.log("URL Conversion successful");
            setConverted(data.id);
          } else {
            // Handle conversion error
            console.error("URL Conversion error:", response.status);
          }
        })
        .catch((error) => {
          console.error("URL Conversion error:", error);
        });
    } else {
      // Conversion for local file
      if (fileId) {
        fetch(`http://localhost:4000/convert/${fileId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          method: "POST",
        })
          .then((response) => {
            if (response.ok) {
              // Handle successful conversion
              console.log("Conversion successful");
              setConverted(true); // Update the parent component's state
            } else {
              // Handle conversion error
              console.error("Conversion error:", response.status);
            }
          })
          .catch((error) => {
            // Handle conversion error
            console.error("Conversion error:", error);
          });
      }
    }
  };

  return (
    <button
      className="convert-button"
      onClick={handleConvert}
      disabled={isConvertDisabled || !fileId}
    >
      Convert to Audio
    </button>
  );
};

export default ConvertButton;
