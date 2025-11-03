import React, { useRef, useState, useEffect } from "react";

// components
import PlaceCard from "./common/PlaceCard";

// styles
import "../../assets/styles/card.css";

/* PlaceCardWrapper Component */
const PlaceCardWrapper = ({ cards = [] }) => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Use cards prop if available, otherwise use empty array
  const places = cards.length > 0 ? cards : [];

  /* Helper function to reset cursor and user selection styles - Cursor style to apply ("grab" or "auto") */
  const resetStyles = (cursor = "grab") => {
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = cursor;
      container.style.userSelect = cursor === "grab" ? "auto" : "none";
    }
  };

  /* Handles mouse down event to start dragging */
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    resetStyles("grabbing");
  };

  /* Handles mouse leave event to stop dragging */
  const handleMouseLeave = () => {
    setIsDragging(false);
    resetStyles();
  };

  /* Handles mouse up event to stop dragging */
  const handleMouseUp = () => {
    setIsDragging(false);
    resetStyles();
  };

  /* Handles mouse move event for drag scrolling */
  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
      return () => {
        container.style.cursor = "auto";
      };
    }
  }, []);

  return (
    <div
      className="place-card-wrapper"
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {places.map((place, index) => (
        <PlaceCard
          key={`place-${place.title}-${index}`}
          indicator={place.indicator}
          visits={place.visits}
          title={place.title}
          address={place.address}
          category={place.category}
        />
      ))}
    </div>
  );
};

export default PlaceCardWrapper;
