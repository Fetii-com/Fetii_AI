import React, { useState, useEffect } from "react";

/* ClearResult Component */
const ClearResult = ({ onClear, isSidebarOpen = false }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hide button on mobile/tablet when sidebar is open
  const shouldHide = isMobile && isSidebarOpen;

  // Inline styles for container positioning - responsive
  const containerStyle = {
    position: "fixed",
    width: isMobile ? "100%" : "calc(100% - 400px)",
    left: isMobile ? "0" : "340px",
    top: "20px",
    display: shouldHide ? "none" : "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10001, // Ensure it's above sidebar overlay (999) and sidebar container (1000)
    pointerEvents: "none", // Allow clicks to pass through container
  };

  // Inline styles for the button
  const buttonStyle = {
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
    padding: "12px 24px",
    lineHeight: "100%",
    fontSize: "13px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "500",
    borderRadius: "24px",
    pointerEvents: "auto", // Enable clicks on button
    userSelect: "none", // Prevent text selection
    WebkitTapHighlightColor: "transparent", // Remove mobile tap highlight
    touchAction: "manipulation", // Improve touch responsiveness
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15);",
    background: "rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  };

  return (
    <div className="clear-result-container" style={containerStyle}>
      <div 
        style={buttonStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClear();
          }
        }}
      >
        Clear Results
      </div>
    </div>
  );
};

export default ClearResult;
