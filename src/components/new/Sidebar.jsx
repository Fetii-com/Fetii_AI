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

/* Sidebar Component */
const Sidebar = ({
  isOpen = true,
  onClose,
  onAssistantCall,
  assistantData,
}) => {
  const textareaRef = useRef(null);
  const contentSectionRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const [contentReachedLogo, setContentReachedLogo] = useState(false);

  // Scroll to bottom on initial render
  useEffect(() => {
    const contentSection = contentSectionRef.current;
    if (contentSection) {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        contentSection.scrollTop = contentSection.scrollHeight;
      });
    }
  }, []);

  // Custom scroll handler - checks if content has scrolled past logo
  useEffect(() => {
    const contentSection = contentSectionRef.current;
    if (!contentSection) return;

    const handleScroll = () => {
      const scrollTop = contentSection.scrollTop;
      // Check if content has scrolled up (scrollTop > 20 means content is being scrolled)
      setContentReachedLogo(scrollTop > 20);
    };

    contentSection.addEventListener("scroll", handleScroll);
    // Check initial state
    handleScroll();

    return () => {
      contentSection.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Auto-grow textarea and scroll content to bottom when textarea expands
  useEffect(() => {
    const textarea = textareaRef.current;
    const contentSection = contentSectionRef.current;

    if (!textarea) return;

    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
    const maxHeight = lineHeight * 5; // Maximum 5 rows

    // Set height based on content, with max constraint
    if (scrollHeight <= maxHeight) {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    } else {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto";
    }

    // When textarea height changes, scroll content section to bottom
    // This makes content appear to move up as textarea expands
    if (contentSection) {
      requestAnimationFrame(() => {
        contentSection.scrollTop = contentSection.scrollHeight;
      });
    }
  }, [inputValue]);

  /* Handles input change in the textarea */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Determine if send button should be active based on input
  const isSendActive = inputValue.trim().length > 0;

  /* Handles suggestion click - adds suggestion to textarea and calls API */
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    if (onAssistantCall) {
      onAssistantCall(suggestion);
    }
  };

  /* Handles send button click */
  const handleSendClick = () => {
    if (inputValue.trim() && onAssistantCall) {
      onAssistantCall(inputValue.trim());
      setInputValue(""); // Clear input after sending
    }
  };

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {isOpen && onClose && (
        <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <div
        className={`sidebar-container ${
          isOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="sidebar-wrapper">
          <div className="sidebar-wrapper-inner">
            <div
              className="sidebar-logo-container"
              style={{
                background: contentReachedLogo
                  ? // ? "rgba(0, 0, 0, 0.3)"
                    "linear-gradient(rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)"
                  : "transparent",
                backdropFilter: contentReachedLogo ? "blur(10px)" : "none",
                WebkitBackdropFilter: contentReachedLogo
                  ? "blur(10px)"
                  : "none",
              }}
            >
              <img src={LogoIcon} alt="Logo" />
            </div>

            <div className="sidebar-content-container">
              {/*===== Suggestions =====*/}
              <div ref={contentSectionRef} className="sidebar-content-section">
                {quickSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="sidebar-quick-suggestion-item"
                    style={{
                      // Add bottom margin only to last item
                      marginBottom:
                        index === quickSuggestions.length - 1 ? "12px" : 0,
                    }}
                  >
                    <div className="sidebar-quick-suggestion-text">
                      {suggestion}
                    </div>
                    <button
                      className="sidebar-quick-suggestion-button"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <img
                        src={LeftDownIcon}
                        alt="Send"
                        className="sidebar-quick-suggestion-icon"
                      />
                    </button>
                  </div>
                ))}

                {/* Show conversation only if assistant has data */}
                {assistantData && (
                  <>
                    {/* User Message */}
                    <div className="sidebar-message sidebar-message-user">
                      <div className="sidebar-message-content seachable-text">
                        {assistantData.userMessage ||
                          "What are the top 5 drop-off locations?"}
                      </div>
                    </div>

                    {/* Assistant Message */}
                    <div className="sidebar-message sidebar-message-assistant">
                      <div className="sidebar-message-content">
                        {assistantData.message}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/*===== Ask about Austin =====*/}
              <div className="sidebar-input-container">
                <textarea
                  ref={textareaRef}
                  placeholder="Ask about Austin..."
                  className="sidebar-textarea-field"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendClick();
                    }
                  }}
                  rows={1}
                />
                <button
                  className="sidebar-send-button"
                  onClick={handleSendClick}
                  disabled={!isSendActive}
                >
                  <img
                    src={isSendActive ? ActiveSendIcon : InactiveSendIcon}
                    alt="Send"
                    className="sidebar-send-icon"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
