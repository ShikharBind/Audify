import React, { useContext } from "react";
import { AccessTokenContext } from './AccessTokenContext';

const ConvertButton = ({ fileId, isConvertDisabled, setConverted }) => {
  const { accessToken } = useContext(AccessTokenContext);

  const handleConvert = () => {
    if (fileId) {
      fetch(`http://localhost:4000/convert/${fileId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
      })
        .then((response) => {
          // Handle successful conversion
          console.log("Conversion successful");
          setConverted(true); // Update the parent component's state
        })
        .catch((error) => {
          // Handle conversion error
          console.error("Conversion error:", error);
        });
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
