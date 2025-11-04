import React, { useState, useEffect, useRef } from "react";

// components
import Sidebar from "../../components/new/Sidebar";
import Header from "../../components/new/Header";
import ClearResult from "../../components/new/ClearResult";
import PlaceCardWrapper from "../../components/new/PlaceCardWrapper";
import LeafletMap from "../../components/new/LeafletMap";
import LoadingUI from "../../components/new/LoadingUI";

// data
import mockData from "../../data/mockData.json";

// styles
import "../../assets/styles/dashboard.css";

/* Desktop breakpoint width (in pixels) */
const DESKTOP_BREAKPOINT = 1024;

/* NewDashboard Component */
const NewDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null); // Track which assistant message is selected
  const timeoutRef = useRef(null);

  /* Handle window resize - on desktop, sidebar should always be open - Automatically opens sidebar on desktop screens (>1024px) */
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > DESKTOP_BREAKPOINT);
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Toggles sidebar open/closed state */
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  /* Closes the sidebar (used for overlay click on mobile/tablet) */
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  /* Handles API call when suggestion is clicked or message is sent */
  const handleAssistantCall = async (message) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear previous results and reset selected marker when loading starts
    setSelectedMarkerId(null);
    setSelectedMessageId(null); // Clear selected message when new query starts
    setIsLoading(true);

    // Add user message to conversation history
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: message,
      timestamp: new Date(),
    };

    setConversationHistory(prev => [...prev, userMessage]);

    // Add loading message
    const loadingMessageId = Date.now() + 1;
    const loadingMessage = {
      id: loadingMessageId,
      type: 'assistant',
      message: '',
      isLoading: true,
      timestamp: new Date(),
    };

    setConversationHistory(prev => [...prev, loadingMessage]);

    // Set 15 second interval before showing mock response
    timeoutRef.current = setTimeout(() => {
      // Pick a random mock data item from the array
      const randomIndex = Math.floor(Math.random() * mockData.length);
      const randomData = mockData[randomIndex];
      const mockResponse = {
        userMessage: message,
        message: randomData.message,
        isLoading: false,
        cards: randomData.cards,
      };

      // Replace loading message with actual response
      let newMessageId = null;
      setConversationHistory(prev => {
        const updated = prev.map(msg => {
          if (msg.isLoading && msg.type === 'assistant') {
            newMessageId = msg.id; // Store the ID of the message being created
            return {
              id: msg.id,
              type: 'assistant',
              message: mockResponse.message,
              isLoading: false,
              cards: mockResponse.cards || [],
              timestamp: new Date(),
            };
          }
          return msg;
        });
        return updated;
      });
      
      // Set the newly created message as selected
      if (newMessageId) {
        setSelectedMessageId(newMessageId);
      }

      setIsLoading(false);
      timeoutRef.current = null;
    }, 15000); // 15 seconds
  };

  /* Clears assistant data and resets to initial state */
  const handleClearResults = () => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setConversationHistory([]);
    setSelectedMarkerId(null);
    setSelectedMessageId(null);
    setIsLoading(false);
  };

  /* Cleanup timeout on unmount */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onAssistantCall={handleAssistantCall}
        conversationHistory={conversationHistory}
        isLoading={isLoading}
        onAssistantMessageClick={setSelectedMessageId}
        selectedMessageId={selectedMessageId}
      />

      {/* Get cards from selected or latest assistant message that has cards - only show when not loading */}
      {(() => {
        // Find the selected message or fall back to latest message with cards
        let messageWithCards = null;
        
        if (selectedMessageId) {
          messageWithCards = conversationHistory.find(msg => msg.id === selectedMessageId && msg.cards && msg.cards.length > 0);
        }
        
        // If no selected message or selected message doesn't have cards, use latest
        if (!messageWithCards) {
          messageWithCards = [...conversationHistory]
            .reverse()
            .find(msg => msg.cards && msg.cards.length > 0);
        }
        
        // Only show cards when not loading and we have a message with cards
        if (isLoading || !messageWithCards) {
          return null;
        }
        
        return (
          <>
            <ClearResult
              onClear={handleClearResults}
              isSidebarOpen={isSidebarOpen}
            />
            <PlaceCardWrapper
              cards={messageWithCards.cards}
              onCardClick={setSelectedMarkerId}
              selectedCardIndex={selectedMarkerId}
            />
          </>
        );
      })()}

      {/*------ Map Functionality ------*/}
      <div className="dashboard-wrapper">
        {(() => {
          // Don't show markers during loading, show empty map
          if (isLoading) {
            return (
              <LeafletMap
                places={[]}
                selectedMarkerId={null}
                onMarkerDeselect={() => setSelectedMarkerId(null)}
                onMarkerSelect={setSelectedMarkerId}
              />
            );
          }

          // Find the selected message or fall back to latest message with cards
          let messageWithCards = null;
          
          if (selectedMessageId) {
            messageWithCards = conversationHistory.find(msg => msg.id === selectedMessageId && msg.cards && msg.cards.length > 0);
          }
          
          // If no selected message or selected message doesn't have cards, use latest
          if (!messageWithCards) {
            messageWithCards = [...conversationHistory]
              .reverse()
              .find(msg => msg.cards && msg.cards.length > 0);
          }
          
          return (
            <LeafletMap
              places={messageWithCards?.cards || []}
              selectedMarkerId={selectedMarkerId}
              onMarkerDeselect={() => setSelectedMarkerId(null)}
              onMarkerSelect={setSelectedMarkerId}
            />
          );
        })()}
      </div>

      <LoadingUI isVisible={isLoading} />
    </>
  );
};

export default NewDashboard;
