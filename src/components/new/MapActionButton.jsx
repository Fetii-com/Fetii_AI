import React from "react";

// images
import PlusIcon from "../../assets/images/plus.svg";
import MinusIcon from "../../assets/images/minus.svg";

/**
 * MapActionButton Component
 * 
 * Floating action buttons for zoom in/out controls on the map.
 * Positioned fixed at the top-right corner of the viewport.
 * 
 * Note: onClick handlers should be added when zoom functionality is implemented.
 */
const MapActionButton = () => {
  // Shared button styles - extracted to avoid duplication
  const buttonStyle = {
    border: "none",
    outline: "none",
    cursor: "pointer",
    backgroundColor: "transparent",
  };

  // Container styles for the button group
  const containerStyle = {
    position: "fixed",
    right: 20,
    top: 20,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 10,
    height: "80px",
    borderRadius: 25,
    backgroundColor: "#007bff",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
    padding: "12px",
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} aria-label="Zoom in">
        <img src={PlusIcon} alt="Plus Icon" />
      </button>
      <button style={buttonStyle} aria-label="Zoom out">
        <img src={MinusIcon} alt="Minus Icon" />
      </button>
    </div>
  );
};

export default MapActionButton;
