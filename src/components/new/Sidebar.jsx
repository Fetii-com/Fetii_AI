import React, { useState, useRef, useEffect } from "react";

// images
import LogoIcon from "../../assets/images/logo.svg";
import InactiveSendIcon from "../../assets/images/inactive-send.svg";
import ActiveSendIcon from "../../assets/images/active-send.svg";
import LeftDownIcon from "../../assets/images/left-down-arrow.svg";

// styles
import "../../assets/styles/sidebar.css";

const quickSuggestions = [
  "What are the top 5 drop-off locations?",
  "Where are college kids frequenting on weekdays?",
  "How far are riders normally traveling to get to De Nada?",
];

const Sidebar = () => {
  const textareaRef = useRef(null);
  const contentSectionRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const [contentReachedLogo, setContentReachedLogo] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-wrapper">
        <div className="sidebar-wrapper-inner">
          <div
            className="sidebar-logo-container"
            style={{
              background: contentReachedLogo
                ? "rgba(0, 0, 0, 0.3)"
                : "transparent",
              backdropFilter: contentReachedLogo ? "blur(10px)" : "none",
              WebkitBackdropFilter: contentReachedLogo ? "blur(10px)" : "none",
            }}
          >
            <img src={LogoIcon} alt="Logo" />
          </div>

          <div className="sidebar-content-container">
            {/*===== content =====*/}
            <div ref={contentSectionRef} className="sidebar-content-section">
              {quickSuggestions.map((suggestion, index) => (
                <div key={index} className="sidebar-quick-suggestion-item">
                  <div className="sidebar-quick-suggestion-text">
                    {suggestion}
                  </div>
                  <button className="sidebar-quick-suggestion-button">
                    <img
                      src={LeftDownIcon}
                      alt="Send"
                      className="sidebar-quick-suggestion-icon"
                    />
                  </button>
                </div>
              ))}
            </div>

            {/*===== Ask about Austin =====*/}
            <div className="sidebar-input-container">
              <textarea
                ref={textareaRef}
                placeholder="Ask about Austin..."
                className="sidebar-textarea-field"
                value={inputValue}
                onChange={handleInputChange}
                rows={1}
              />
              <button className="sidebar-send-button">
                <img
                  src={InactiveSendIcon}
                  alt="Send"
                  className="sidebar-send-icon"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
