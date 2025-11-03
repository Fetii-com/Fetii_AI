import React, { useState, useEffect } from "react";

// components
import Sidebar from "../../components/new/Sidebar";
import Header from "../../components/new/Header";
import ClearResult from "../../components/new/ClearResult";
import PlaceCardWrapper from "../../components/new/PlaceCardWrapper";
import LeafletMap from "../../components/new/LeafletMap";

// styles
import "../../assets/styles/dashboard.css";

// images
import DummyMapImage from "../../assets/images/dummy-map.png";

/* Desktop breakpoint width (in pixels) */
const DESKTOP_BREAKPOINT = 1024;

/* NewDashboard Component */
const NewDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assistantData, setAssistantData] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

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
    try {
      // TODO: Replace with actual API call
      // For now, simulating API response with sample data
      const mockResponse = {
        userMessage: message,
        message:
          "Based on our Austin trip data from the last six months, here are the top 5 busiest destinations where Fetii groups travel:",
        cards: [
          {
            indicator: 1,
            visits: 64,
            title: "The Aquarium on 6th",
            address: "East 6th Street, Austin, TX",
            category: "Entertainment",
            lat: 30.2672,
            lng: -97.7324,
          },
          {
            indicator: 2,
            visits: 52,
            title: "Wiggle Room",
            address: "Nueces Street, Austin, TX",
            category: "Nightlife",
            lat: 30.2691,
            lng: -97.7501,
          },
          {
            indicator: 3,
            visits: 45,
            title: "Shakespeare's",
            address: "East 6th Street, Austin, TX",
            category: "Entertainment",
            lat: 30.2678,
            lng: -97.733,
          },
          {
            indicator: 4,
            visits: 43,
            title: "Mayfair Austin",
            address: "West 6th Street, Austin, TX",
            category: "Nightlife",
            lat: 30.2685,
            lng: -97.7519,
          },
          {
            indicator: 5,
            visits: 32,
            title: "Latchkey",
            address: "East 6th Street, Austin, TX",
            category: "Entertainment",
            lat: 30.2668,
            lng: -97.732,
          },
        ],
      };

      setAssistantData(mockResponse);
    } catch (error) {
      console.error("Error calling assistant API:", error);
    }
  };

  /* Clears assistant data and resets to initial state */
  const handleClearResults = () => {
    setAssistantData(null);
    setSelectedMarkerId(null);
  };

  return (
    <>
      <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onAssistantCall={handleAssistantCall}
        assistantData={assistantData}
      />

      {assistantData && (
        <ClearResult
          onClear={handleClearResults}
          isSidebarOpen={isSidebarOpen}
        />
      )}

      {assistantData && assistantData.cards && (
        <PlaceCardWrapper
          cards={assistantData.cards}
          onCardClick={setSelectedMarkerId}
          selectedCardIndex={selectedMarkerId}
        />
      )}

      {/*------ Map and other functionality will be here ------*/}
      <div className="dashboard-wrapper">
        <LeafletMap
          places={assistantData?.cards || []}
          selectedMarkerId={selectedMarkerId}
          onMarkerDeselect={() => setSelectedMarkerId(null)}
          onMarkerSelect={setSelectedMarkerId}
        />
      </div>
    </>
  );
};

export default NewDashboard;
