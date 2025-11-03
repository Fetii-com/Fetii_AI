import React from "react";
import { useMap } from "react-leaflet";

// images
import PlusIcon from "../../assets/images/plus.svg";
import MinusIcon from "../../assets/images/minus.svg";

/**
 * MapActionButton Component
 * 
 * Floating action buttons for zoom in/out controls on the map.
 * This component must be rendered inside a MapContainer to use useMap hook.
 * Positioned absolutely at the top-right corner.
 */
const MapActionButton = () => {
  const map = useMap();

  // Handle zoom in
  const handleZoomIn = () => {
    map.zoomIn();
  };

  // Handle zoom out
  const handleZoomOut = () => {
    map.zoomOut();
  };

  // Shared button styles - extracted to avoid duplication
  const buttonStyle = {
    border: "none",
    outline: "none",
    cursor: "pointer",
    backgroundColor: "transparent",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s",
  };

  // Container styles for the button group
  const containerStyle = {
    position: "fixed",
    right: 20,
    top: 20,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 10,
    height: "80px",
    borderRadius: 24,
    backgroundColor: "#007bff",
    color: "#fff",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15);",
    background: "rgba(0, 0, 0, 0.15)",
    padding: "12px",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  };

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle}
        onClick={handleZoomIn}
        aria-label="Zoom in"
        type="button"
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <img src={PlusIcon} alt="Plus Icon" width="20" height="20" />
      </button>
      <button
        style={buttonStyle}
        onClick={handleZoomOut}
        aria-label="Zoom out"
        type="button"
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <img src={MinusIcon} alt="Minus Icon" width="20" height="20" />
      </button>
    </div>
  );
};

export default MapActionButton;
